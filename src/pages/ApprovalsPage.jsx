import { useState, useMemo } from 'react'
import {
  CheckCircle, ShieldCheck
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import { useApprovals } from '../context/ApprovalsContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'
import { APPROVAL_STATUS_COLORS } from '../data/approvalsData'
import { formatDate } from '../utils/helpers'

export default function ApprovalsPage() {
  const { approvals, approveRequest, rejectRequest } = useApprovals()
  const { toasts, toast, dismiss } = useToast()

  const [activeTab, setActiveTab] = useState('PENDING')
  const [selectedApproval, setSelectedApproval] = useState(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const filteredApprovals = useMemo(() => {
    return approvals.filter(a => a.status === activeTab)
  }, [approvals, activeTab])

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length
  const approvedCount = approvals.filter(a => a.status === 'APPROVED').length
  const rejectedCount = approvals.filter(a => a.status === 'REJECTED').length

  const handleApprove = (approval) => {
    approveRequest(approval.id)
    toast.success(`Approval granted for ${approval.id}`)
    setSelectedApproval(null)
  }

  const handleRejectConfirm = (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      toast.error('Please specify a rejection justification')
      return
    }
    rejectRequest(selectedApproval.id, rejectReason.trim())
    toast.info(`Request ${selectedApproval.id} has been formally rejected`)
    setRejectModalOpen(false)
    setSelectedApproval(null)
    setRejectReason('')
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
            Approvals & Governance Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review and adjudicate corporate procurement, hardware budgets and IAM privileged access
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center rounded-lg border border-[#EDE8FA] bg-white p-1 text-xs">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'PENDING'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600  hover:text-slate-900'
            }`}
          >
            Pending <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{pendingCount}</span>
          </button>
          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600  hover:text-slate-900'
            }`}
          >
            Approved <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{approvedCount}</span>
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'REJECTED'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600  hover:text-slate-900'
            }`}
          >
            Rejected <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">{rejectedCount}</span>
          </button>
        </div>
      </div>

      {/* Approvals Cards Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredApprovals.map(approval => (
          <Card key={approval.id} hover className="flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#6D4AFF]">
                  {approval.id}
                </span>
                <Badge color={APPROVAL_STATUS_COLORS[approval.status]} dot>
                  {approval.status}
                </Badge>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">
                  {approval.type}
                </span>
                <h3 className="text-sm font-semibold text-slate-800 mt-0.5 line-clamp-1">
                  {approval.title}
                </h3>
              </div>

              <div className="p-2 rounded bg-slate-50 text-xs font-medium text-slate-700">
                Scope / Value: <span className="font-semibold text-[#6D4AFF]">{approval.amountOrDetails}</span>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {approval.justification}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Avatar name={approval.requestor} size="xs" />
                  {approval.requestor} ({approval.department})
                </span>
                <span>{formatDate(approval.submittedDate)}</span>
              </div>

              {approval.status === 'PENDING' ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setSelectedApproval(approval)
                      setRejectModalOpen(true)
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleApprove(approval)}
                  >
                    Approve
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={() => setSelectedApproval(approval)}
                >
                  View Audit Record
                </Button>
              )}
            </div>
          </Card>
        ))}

        {filteredApprovals.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-xl border border-[#EDE8FA]">
            <ShieldCheck size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              Queue is clear
            </p>
            <p className="text-xs text-slate-400 mt-1">
              No approval requests are currently in {activeTab.toLowerCase()} state.
            </p>
          </div>
        )}
      </div>

      {/* Reject Justification Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title={`Reject Authorization — ${selectedApproval?.id}`}
        size="md"
      >
        <form onSubmit={handleRejectConfirm} className="space-y-3.5">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            Please document the administrative or corporate policy justification for declining this request.
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Formal Reason for Rejection *
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Existing corporate agreement already provides equivalent coverage..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#EDE8FA] bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setRejectModalOpen(false)}>
              Back
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Audit Details Modal */}
      {selectedApproval && !rejectModalOpen && (
        <Modal
          open={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title={`Approval Audit Log — ${selectedApproval.id}`}
          size="lg"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedApproval(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">{selectedApproval.title}</h3>
                <span className="text-slate-400">{selectedApproval.type} • Requested by {selectedApproval.requestor}</span>
              </div>
              <Badge color={APPROVAL_STATUS_COLORS[selectedApproval.status]} dot>
                {selectedApproval.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-slate-700 block">Scope Justification:</span>
              <p className="p-2.5 rounded bg-slate-50 text-slate-600">
                {selectedApproval.justification}
              </p>
            </div>

            {selectedApproval.rejectionReason && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <span className="font-semibold text-red-700 block mb-0.5">Rejection Rationale:</span>
                <p className="text-red-600">{selectedApproval.rejectionReason}</p>
              </div>
            )}

            <div>
              <span className="font-semibold text-slate-700 block mb-2">History & Actions:</span>
              <div className="space-y-2">
                {(selectedApproval.history || []).map(hist => (
                  <div key={hist.id} className="flex items-start gap-2.5 p-2 rounded border border-[#EDE8FA]/60">
                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between font-medium text-slate-700">
                        <span>{hist.action} by {hist.actor}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(hist.date)}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{hist.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
