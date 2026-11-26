import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Plus, Search,
  ArrowRight, MessageSquare,
  Server, Trash2
} from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import { useBugs } from '../context/BugsContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'
import {
  BUG_STATUSES, BUG_STATUS_LABELS, BUG_STATUS_COLORS,
  BUG_SEVERITIES, BUG_SEVERITY_COLORS, BUG_ENVIRONMENTS, BUG_TRANSITIONS
} from '../data/bugsData'
import { formatDate } from '../utils/helpers'

export default function BugsPage() {
  const { bugs, reportBug, changeBugStatus, assignDeveloper, addComment, deleteBug } = useBugs()
  const { toasts, toast, dismiss } = useToast()
  const location = useLocation()

  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [envFilter, setEnvFilter] = useState('')
  const [reportModalOpen, setReportModalOpen] = useState(false)

  useEffect(() => {
    if (location.pathname === '/employee/new-bug') {
      setReportModalOpen(true)
    }
  }, [location.pathname])
  const [selectedBug, setSelectedBug] = useState(null)
  const [newComment, setNewComment] = useState('')

  // Report Form State
  const [formData, setFormData] = useState({
    title: '',
    severity: 'Medium',
    environment: 'Production',
    assignedTo: '',
    reproductionSteps: '',
    expectedResult: '',
    actualResult: '',
  })

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const matchSearch =
        bug.title.toLowerCase().includes(search.toLowerCase()) ||
        bug.id.toLowerCase().includes(search.toLowerCase()) ||
        (bug.assignedTo || '').toLowerCase().includes(search.toLowerCase())
      const matchSeverity = severityFilter ? bug.severity === severityFilter : true
      const matchStatus = statusFilter ? bug.status === statusFilter : true
      const matchEnv = envFilter ? bug.environment === envFilter : true
      return matchSearch && matchSeverity && matchStatus && matchEnv
    })
  }, [bugs, search, severityFilter, statusFilter, envFilter])

  const handleReportSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Bug title is required')
      return
    }
    const newBug = reportBug(formData)
    toast.success(`Defect ${newBug.id} logged successfully`)
    setReportModalOpen(false)
    setFormData({
      title: '',
      severity: 'Medium',
      environment: 'Production',
      assignedTo: '',
      reproductionSteps: '',
      expectedResult: '',
      actualResult: '',
    })
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedBug) return
    addComment(selectedBug.id, newComment.trim())
    setNewComment('')
    toast.success('Investigation note logged')
    const updated = bugs.find(b => b.id === selectedBug.id)
    if (updated) setSelectedBug(updated)
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
            Defect & Bug Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log system discrepancies, monitor environment telemetry and track engineering fixes
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          iconLeft={<Plus size={14} />}
          onClick={() => setReportModalOpen(true)}
        >
          Report a Defect
        </Button>
      </div>

      {/* KPI Severity Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BUG_SEVERITIES.map(sev => {
          const count = bugs.filter(b => b.severity === sev && b.status !== 'CLOSED').length
          return (
            <div
              key={sev}
              onClick={() => setSeverityFilter(prev => prev === sev ? '' : sev)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                severityFilter === sev
                  ? 'border-blue-500 bg-[#F4F2FF]/50 '
                  : 'border-[#EDE8FA]  bg-white '
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">{sev}</span>
                <Badge color={BUG_SEVERITY_COLORS[sev]} dot>{count}</Badge>
              </div>
              <p className="text-lg font-bold text-slate-800 mt-1">{count} Active</p>
            </div>
          )
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#EDE8FA] shadow-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by defect ID, title, developer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-[#EDE8FA] bg-slate-50 text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-[#EDE8FA] bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {BUG_STATUSES.map(s => <option key={s} value={s}>{BUG_STATUS_LABELS[s]}</option>)}
          </select>

          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-[#EDE8FA] bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Environments</option>
            {BUG_ENVIRONMENTS.map(env => <option key={env} value={env}>{env}</option>)}
          </select>

          {(search || severityFilter || statusFilter || envFilter) && (
            <button
              onClick={() => { setSearch(''); setSeverityFilter(''); setStatusFilter(''); setEnvFilter('') }}
              className="text-xs text-[#6D4AFF] hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Bugs Table */}
      <div className="rounded-xl border border-[#EDE8FA] overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#EDE8FA] text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Bug ID</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Environment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Dev</th>
                <th className="py-3 px-4">Reported</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBugs.map(bug => (
                <tr
                  key={bug.id}
                  onClick={() => setSelectedBug(bug)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-bold text-red-600 whitespace-nowrap">
                    {bug.id}
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <p className="font-semibold text-slate-800 truncate">{bug.title}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Reported by {bug.reportedBy}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge color={BUG_SEVERITY_COLORS[bug.severity]} dot>
                      {bug.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      <Server size={11} className="text-slate-400" /> {bug.environment}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge color={BUG_STATUS_COLORS[bug.status]} dot>
                      {BUG_STATUS_LABELS[bug.status]}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {bug.assignedTo ? (
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Avatar name={bug.assignedTo} size="xs" />
                        {bug.assignedTo}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                    {formatDate(bug.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        deleteBug(bug.id)
                        if (selectedBug?.id === bug.id) setSelectedBug(null)
                        toast.info(`Defect ${bug.id} removed`)
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Defect"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBugs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No defects matching current filter parameters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bug Details Modal */}
      {selectedBug && (
        <Modal
          open={!!selectedBug}
          onClose={() => setSelectedBug(null)}
          title={`Defect Specification — ${selectedBug.id}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {/* Allowed Workflow Status Progression */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Workflow:</span>
                {(BUG_TRANSITIONS[selectedBug.status] || []).map(next => (
                  <Button
                    key={next}
                    size="xs"
                    variant="outline"
                    iconRight={<ArrowRight size={11} />}
                    onClick={() => {
                      changeBugStatus(selectedBug.id, next)
                      toast.success(`Defect updated to ${BUG_STATUS_LABELS[next]}`)
                      setSelectedBug(prev => ({ ...prev, status: next }))
                    }}
                  >
                    {BUG_STATUS_LABELS[next]}
                  </Button>
                ))}
              </div>

              <Button size="sm" variant="primary" onClick={() => setSelectedBug(null)}>
                Dismiss
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge color={BUG_SEVERITY_COLORS[selectedBug.severity]} dot>
                  {selectedBug.severity}
                </Badge>
                <Badge color={BUG_STATUS_COLORS[selectedBug.status]}>
                  {BUG_STATUS_LABELS[selectedBug.status]}
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  Env: {selectedBug.environment}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-[#1E293B]">
                {selectedBug.title}
              </h3>
            </div>

            {/* Repro Steps & Actual / Expected Results */}
            <div className="space-y-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">
                  Steps to Reproduce:
                </span>
                <p className="whitespace-pre-wrap font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded border border-[#EDE8FA] leading-relaxed">
                  {selectedBug.reproductionSteps || 'No reproduction instructions submitted.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    Expected Result:
                  </span>
                  <p className="text-slate-600">
                    {selectedBug.expectedResult || 'Expected normal workflow operation.'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold text-red-600 block mb-0.5">
                    Actual Result:
                  </span>
                  <p className="text-slate-600">
                    {selectedBug.actualResult || 'Error reported during execution.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Developer Assignment Picker */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 text-xs">
              <div>
                <span className="font-medium text-slate-700 block">Assigned Engineer</span>
                <span className="text-[11px] text-slate-400">Assign a core developer to investigate and patch</span>
              </div>
              <select
                value={selectedBug.assignedTo || ''}
                onChange={(e) => {
                  assignDeveloper(selectedBug.id, e.target.value)
                  toast.success(`Assigned to ${e.target.value}`)
                  setSelectedBug(prev => ({
                    ...prev,
                    assignedTo: e.target.value,
                    status: prev.status === 'OPEN' ? 'ASSIGNED' : prev.status,
                  }))
                }}
                className="h-8 px-2.5 rounded-lg border border-[#EDE8FA] bg-white text-xs font-medium"
              >
                <option value="">Unassigned</option>
                <option value="James Wilson">James Wilson</option>
                <option value="Mike Torres">Mike Torres</option>
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Tara Anand">Tara Anand</option>
              </select>
            </div>

            {/* Comments Stream */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <MessageSquare size={13} /> Engineering Discussion ({selectedBug.comments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto mb-3">
                {(selectedBug.comments || []).map(comm => (
                  <div key={comm.id} className="p-2.5 rounded-lg bg-slate-50 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-slate-700">{comm.author}</span>
                      <span>{formatDate(comm.date)}</span>
                    </div>
                    <p className="text-slate-600">{comm.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add diagnostic notes or pull request link..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 h-8 px-3 rounded-lg border border-[#EDE8FA] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
                />
                <Button size="sm" type="submit" disabled={!newComment.trim()}>
                  Post Note
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Bug Modal */}
      <Modal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report New Defect"
        size="lg"
      >
        <form onSubmit={handleReportSubmit} className="space-y-3.5">
          <Input
            label="Defect Headline *"
            placeholder="e.g. SAML authentication failed with 401 error"
            value={formData.title}
            onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData(f => ({ ...f, severity: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                {BUG_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Environment</label>
              <select
                value={formData.environment}
                onChange={(e) => setFormData(f => ({ ...f, environment: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                {BUG_ENVIRONMENTS.map(env => <option key={env} value={env}>{env}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Assignee</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData(f => ({ ...f, assignedTo: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                <option value="">Leave Unassigned</option>
                <option value="James Wilson">James Wilson</option>
                <option value="Mike Torres">Mike Torres</option>
                <option value="Sarah Chen">Sarah Chen</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Reproduction Steps *
            </label>
            <textarea
              rows={3}
              placeholder="1. Navigate to...\n2. Click on...\n3. Observe error..."
              value={formData.reproductionSteps}
              onChange={(e) => setFormData(f => ({ ...f, reproductionSteps: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#EDE8FA] bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Expected Result</label>
              <textarea
                rows={2}
                placeholder="What should happen under standard operation..."
                value={formData.expectedResult}
                onChange={(e) => setFormData(f => ({ ...f, expectedResult: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#EDE8FA] bg-white text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Actual Result</label>
              <textarea
                rows={2}
                placeholder="Observed faulty behavior or error message..."
                value={formData.actualResult}
                onChange={(e) => setFormData(f => ({ ...f, actualResult: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#EDE8FA] bg-white text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setReportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Submit Defect
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
