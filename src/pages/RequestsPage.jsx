import { useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList, Plus, Inbox, CheckCircle2,
  Loader2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRequests } from '../context/RequestsContext'
import { useToast } from '../hooks/useToast'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ToastContainer from '../components/ui/Toast'
import RequestTable from '../components/requests/RequestTable'
import RequestDetail from '../components/requests/RequestDetail'
import RequestForm from '../components/requests/RequestForm'
import CancelDialog from '../components/requests/CancelDialog'

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconColor, iconBg, active, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.13 }}
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 flex items-center gap-4 shadow-xs transition-all duration-150 ${active
        ? 'bg-[#6D4AFF] border-[#6D4AFF] text-white shadow-md shadow-blue-600/20'
        : 'bg-white  border-[#EDE8FA]  hover:border-[#A78BFA]'
        }`}
    >
      <div className={`flex items-center justify-center h-10 w-10 rounded-xl shrink-0 ${active ? 'bg-white/20' : iconBg}`}>
        <Icon size={20} className={active ? 'text-white' : iconColor} />
      </div>
      <div>
        <p className={`text-xs ${active ? 'text-blue-100' : 'text-slate-500 '}`}>{label}</p>
        <p className={`text-2xl font-bold leading-tight ${active ? 'text-white' : 'text-slate-900 '}`}>
          {value}
        </p>
      </div>
    </motion.button>
  )
}

// ─── View states ──────────────────────────────────────────────────────────────
const VIEW_LIST = 'list'
const VIEW_DETAIL = 'detail'

export default function RequestsPage() {
  const { requests, createRequest, updateRequest, changeStatus, cancelRequest, addComment } = useRequests()
  const { toasts, toast, dismiss } = useToast()
  const location = useLocation()
  const navigate = useNavigate()
  const { id: routeRequestId } = useParams()
  const { user } = useAuth()

  const [view, setView] = useState(VIEW_LIST)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  // Determine portal base path for navigation
  const role = (user?.role || '').toUpperCase()
  const basePath = role === 'ADMIN' ? '/admin/requests' : role.includes('LEAD') ? '/lead/requests' : '/employee/requests'

  // Modal states
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)

  useEffect(() => {
    if (location.pathname === '/employee/new-request') {
      setCreateOpen(true)
    }
  }, [location.pathname])

  // Sync route param :id with selected request detail view
  useEffect(() => {
    if (routeRequestId) {
      const match = requests.find(r => String(r.id).toLowerCase() === String(routeRequestId).toLowerCase())
      if (match) {
        setSelectedRequest(match)
        setView(VIEW_DETAIL)
      } else {
        // If not in local cache yet (or newly seeded), attempt to find or keep current if id matches
        setSelectedRequest(prev => {
          if (prev && String(prev.id).toLowerCase() === String(routeRequestId).toLowerCase()) {
            return prev
          }
          return {
            id: routeRequestId,
            title: `Request ${routeRequestId}`,
            department: 'IT Support',
            category: 'General',
            priority: 'Medium',
            status: 'In Progress',
            assignedTo: 'Unassigned',
            createdBy: user?.name || 'User',
            createdAt: new Date().toISOString(),
            description: `Details for request ${routeRequestId}`,
            timeline: []
          }
        })
        setView(VIEW_DETAIL)
      }
    } else {
      setView(VIEW_LIST)
      setSelectedRequest(null)
    }
  }, [routeRequestId, requests, user?.name])

  // ─── Stats ───────────────────────────────────────────────────────────────
  const stats = {
    total: requests.length,
    open: requests.filter(r => ['New', 'Assigned', 'Reopened'].includes(r.status)).length,
    inProgress: requests.filter(r => r.status === 'In Progress').length,
    resolved: requests.filter(r => ['Resolved', 'Closed'].includes(r.status)).length,
  }

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleCreate = (formData) => {
    const req = createRequest(formData)
    setCreateOpen(false)
    toast.success(`Request ${req.id} submitted successfully.`)
  }

  const handleEdit = (formData) => {
    updateRequest(editTarget.id, formData)
    setEditTarget(null)
    toast.success('Request updated successfully.')
    // If viewing detail, refresh the selected request
    if (selectedRequest?.id === editTarget.id) {
      setSelectedRequest(prev => ({ ...prev, ...formData }))
    }
  }

  const handleCancel = (id, reason) => {
    cancelRequest(id, reason)
    setCancelTarget(null)
    toast.info('Request has been cancelled.')
    if (selectedRequest?.id === id) {
      setView(VIEW_LIST)
      setSelectedRequest(null)
    }
  }

  const handleChangeStatus = (id, newStatus) => {
    const success = changeStatus(id, newStatus)
    if (success) {
      toast.success(`Status updated to ${newStatus}.`)
      // Sync detail view
      if (selectedRequest?.id === id) {
        setSelectedRequest(r => ({
          ...r,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          timeline: [
            ...r.timeline,
            { id: Date.now(), type: 'status', actor: 'Tara Anand', note: `Status changed to ${newStatus}.`, date: new Date().toISOString() }
          ]
        }))
      }
    } else {
      toast.error(`Transition to ${newStatus} is not permitted from current status.`)
    }
  }

  const handleAddComment = (id, comment) => {
    addComment(id, comment)
    toast.success('Comment added.')
    if (selectedRequest?.id === id) {
      const entry = { id: Date.now(), type: 'comment', actor: 'Tara Anand', note: comment, date: new Date().toISOString() }
      setSelectedRequest(r => ({ ...r, timeline: [...r.timeline, entry] }))
    }
  }

  const handleView = (req) => {
    setSelectedRequest(req)
    setView(VIEW_DETAIL)
    navigate(`${basePath}/${req.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setView(VIEW_LIST)
    setSelectedRequest(null)
    navigate(basePath)
  }

  const STAT_CONFIGS = [
    { label: 'Total Requests', key: 'total', icon: ClipboardList, iconColor: 'text-[#6D4AFF]', iconBg: 'bg-blue-100 ', filter: '' },
    { label: 'Open', key: 'open', icon: Inbox, iconColor: 'text-[#A78BFA]', iconBg: 'bg-[#F4F2FF] ', filter: 'open' },
    { label: 'In Progress', key: 'inProgress', icon: Loader2, iconColor: 'text-amber-500', iconBg: 'bg-amber-50 ', filter: 'inprogress' },
    { label: 'Resolved / Closed', key: 'resolved', icon: CheckCircle2, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50 ', filter: 'resolved' },
  ]

  const tableRequests = statusFilter === 'open'
    ? requests.filter(r => ['New', 'Assigned', 'Reopened'].includes(r.status))
    : statusFilter === 'inprogress'
      ? requests.filter(r => r.status === 'In Progress')
      : statusFilter === 'resolved'
        ? requests.filter(r => ['Resolved', 'Closed'].includes(r.status))
        : requests

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h1 className="text-lg font-semibold text-slate-900">My Requests</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit and track your IT service requests and workplace needs.
          </p>
        </div>
        {view === VIEW_LIST && (
          <Button
            variant="primary"
            size="md"
            iconLeft={<Plus size={15} />}
            onClick={() => setCreateOpen(true)}
          >
            Create New Request
          </Button>
        )}
      </motion.div>

      {/* Summary Stats — only on list view */}
      {view === VIEW_LIST && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="grid grid-cols-2 xl:grid-cols-4 gap-3"
        >
          {STAT_CONFIGS.map(({ label, key, icon, iconColor, iconBg, filter }) => (
            <StatCard
              key={key}
              label={label}
              value={stats[key]}
              icon={icon}
              iconColor={iconColor}
              iconBg={iconBg}
              active={statusFilter === filter}
              onClick={() => setStatusFilter(f => f === filter ? '' : filter)}
            />
          ))}
        </motion.div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {view === VIEW_LIST ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <RequestTable
              requests={tableRequests}
              onView={handleView}
              onEdit={(req) => setEditTarget(req)}
              onCancel={(req) => setCancelTarget(req)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {selectedRequest && (
              <RequestDetail
                request={selectedRequest}
                onBack={handleBack}
                onEdit={(req) => setEditTarget(req)}
                onCancel={(req) => setCancelTarget(req)}
                onChangeStatus={handleChangeStatus}
                onAddComment={handleAddComment}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Request"
        description="Fill in the details below to submit a new service request."
        size="2xl"
        closeOnOverlay={false}
      >
        <RequestForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Request"
        description={`Editing ${editTarget?.id}`}
        size="2xl"
        closeOnOverlay={false}
      >
        {editTarget && (
          <RequestForm
            initialData={editTarget}
            onSubmit={handleEdit}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Cancel Dialog */}
      {cancelTarget && (
        <CancelDialog
          request={cancelTarget}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
