import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Users,
  Paperclip, MessageSquare, Send, ChevronDown,
  Pencil, Ban, RefreshCw, CheckCircle, Circle
} from 'lucide-react'
import { cn, formatDate } from '../../utils/helpers'
import { InfoRow, PriorityBadge, StatusBadge } from './RequestShared'
import { STATUS_TRANSITIONS } from '../../data/requestsData'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Card from '../ui/Card'

// ─── Timeline ────────────────────────────────────────────────────────────────

const TIMELINE_ICON = {
  created: { icon: Circle, color: 'text-[#6D4AFF]', bg: 'bg-blue-100 ' },
  assigned: { icon: Users, color: 'text-[#A78BFA]', bg: 'bg-[#F4F2FF] ' },
  status: { icon: RefreshCw, color: 'text-amber-500', bg: 'bg-amber-100 ' },
  comment: { icon: MessageSquare, color: 'text-slate-500', bg: 'bg-slate-100 ' },
  resolution: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 ' },
}

function TimelineItem({ item, isLast }) {
  const cfg = TIMELINE_ICON[item.type] || TIMELINE_ICON.comment
  const Icon = cfg.icon
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn('flex items-center justify-center h-7 w-7 rounded-full shrink-0', cfg.bg)}>
          <Icon size={13} className={cfg.color} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <span className="text-xs font-medium text-slate-700">{item.actor}</span>
            <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
          </div>
          <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">{formatDate(item.date)}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Status transition picker ─────────────────────────────────────────────────

function StatusChanger({ request, onChangeStatus }) {
  const [open, setOpen] = useState(false)
  const transitions = STATUS_TRANSITIONS[request.status] || []

  if (transitions.length === 0) return null

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        iconRight={<ChevronDown size={13} />}
        onClick={() => setOpen(o => !o)}
      >
        Update Status
      </Button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className={cn( 'absolute right-0 top-full mt-1 w-44 py-1 z-20', 'bg-white ', 'border border-[#EDE8FA] ', 'rounded-xl shadow-lg' )}
          >
            {transitions.map(s => (
              <button
                key={s}
                onClick={() => { onChangeStatus(request.id, s); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-xs text-[#1E293B] hover:bg-[#F4F2FF] transition-colors"
              >
                &rarr; {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main detail panel ────────────────────────────────────────────────────────

export default function RequestDetail({ request, onBack, onEdit, onCancel, onChangeStatus, onAddComment }) {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const canEdit = !['Closed', 'Rejected', 'Cancelled', 'Resolved'].includes(request.status)

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 400))
    onAddComment(request.id, comment.trim())
    setComment('')
    setSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Back bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#6D4AFF] transition-colors font-semibold"
        >
          <ArrowLeft size={15} />
          Back to Requests
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusChanger request={request} onChangeStatus={onChangeStatus} />
          {canEdit && (
            <Button variant="secondary" size="sm" iconLeft={<Pencil size={13} />} onClick={() => onEdit(request)}>
              Edit
            </Button>
          )}
          {canEdit && (
            <Button variant="danger" size="sm" iconLeft={<Ban size={13} />} onClick={() => onCancel(request)}>
              Cancel Request
            </Button>
          )}
        </div>
      </div>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {request.id}
              </span>
              <PriorityBadge priority={request.priority} />
              <StatusBadge status={request.status} />
            </div>
            <h2 className="text-base font-semibold text-slate-900 leading-snug">
              {request.title}
            </h2>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5 pb-5 border-b border-slate-100">
          <InfoRow label="Category">{request.category}</InfoRow>
          <InfoRow label="Department">{request.department}</InfoRow>
          <InfoRow label="Created By">
            <span className="flex items-center gap-1.5">
              <Avatar name={request.createdBy} size="xs" />
              {request.createdBy}
            </span>
          </InfoRow>
          <InfoRow label="Assigned To">
            {request.assignedTo ? (
              <span className="flex items-center gap-1.5">
                <Avatar name={request.assignedTo} size="xs" />
                {request.assignedTo}
              </span>
            ) : (
              <span className="text-slate-400 italic">Unassigned</span>
            )}
          </InfoRow>
          <InfoRow label="Created">{formatDate(request.createdAt)}</InfoRow>
          <InfoRow label="Last Updated">{formatDate(request.updatedAt)}</InfoRow>
          <InfoRow label="Attachments">
            {request.attachments.length > 0
              ? `${request.attachments.length} file${request.attachments.length > 1 ? 's' : ''}`
              : 'None'}
          </InfoRow>
        </div>

        {/* Description */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Description</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {request.description}
          </p>
        </div>

        {/* Attachments */}
        {request.attachments.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Attachments</p>
            <div className="flex flex-wrap gap-2">
              {request.attachments.map(a => (
                <div key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                  <Paperclip size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-700">{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Activity Timeline */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-800 mb-5">Activity Timeline</h3>
        <div>
          {[...request.timeline].reverse().map((item, idx, arr) => (
            <TimelineItem key={item.id} item={item} isLast={idx === arr.length - 1} />
          ))}
        </div>

        {/* Add comment */}
        <form onSubmit={handleComment} className="mt-2 pt-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-600 mb-2">Add a comment</p>
          <div className="flex gap-2">
            <Avatar name="Tara Anand" size="sm" className="shrink-0 mt-0.5" />
            <div className="flex-1 relative">
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write a comment or update…"
                rows={2}
                className={cn( 'w-full rounded-lg border bg-white px-3 py-2 text-sm', 'text-slate-900 resize-none', 'placeholder:text-slate-400 ', 'border-slate-200 ', 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent', 'transition-colors duration-150' )}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              disabled={!comment.trim()}
              iconLeft={<Send size={13} />}
              className="self-end"
            >
              Post
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  )
}
