import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, X, ClipboardList, CheckSquare, Bug, Users, ArrowRight } from 'lucide-react'
import { useRequests } from '../../context/RequestsContext'
import { useTasks } from '../../context/TasksContext'
import { useBugs } from '../../context/BugsContext'
import { useTeam } from '../../context/TeamContext'
import Badge from '../ui/Badge'

export default function GlobalSearchModal({ open, onClose }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { requests = [] } = useRequests() || {}
  const { tasks = [] } = useTasks() || {}
  const { bugs = [] } = useBugs() || {}
  const { members = [] } = useTeam() || {}

  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!open) return null

  const q = query.toLowerCase().trim()

  const matchRequests = q
    ? requests.filter(r => r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)).slice(0, 4)
    : []

  const matchTasks = q
    ? tasks.filter(t => t.id.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.priority.toLowerCase().includes(q)).slice(0, 4)
    : []

  const matchBugs = q
    ? bugs.filter(b => b.id.toLowerCase().includes(q) || b.title.toLowerCase().includes(q) || b.severity.toLowerCase().includes(q)).slice(0, 4)
    : []

  const matchTeam = q
    ? members.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.department.toLowerCase().includes(q)).slice(0, 4)
    : []

  const totalMatches = matchRequests.length + matchTasks.length + matchBugs.length + matchTeam.length

  const handleSelect = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.16 }}
        className="relative w-full max-w-xl bg-white border border-[#EDE8FA] rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#EDE8FA]">
          <Search size={18} className="text-[#6D4AFF] shrink-0" />
          <input
            type="text"
            placeholder="Search across requests, tasks, defects and team members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-[#6D4AFF] bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-4">
          {!q && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-xs">Type a keyword, request ID (e.g. REQ-1001), or employee name</p>
            </div>
          )}

          {q && totalMatches === 0 && (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try searching for a different ID or keyword</p>
            </div>
          )}

          {/* Requests Matches */}
          {matchRequests.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#6D4AFF] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <ClipboardList size={12} /> Requests ({matchRequests.length})
              </p>
              <div className="space-y-1">
                {matchRequests.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect('/requests')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F2FF] text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#6D4AFF]">{r.id}</span>
                        <span className="text-xs font-medium text-[#1E293B] truncate">{r.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{r.category} &bull; {r.department}</p>
                    </div>
                    <Badge color={r.status === 'Resolved' ? 'green' : 'purple'} className="shrink-0">{r.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Matches */}
          {matchTasks.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#6D4AFF] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <CheckSquare size={12} /> Tasks ({matchTasks.length})
              </p>
              <div className="space-y-1">
                {matchTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect('/tasks')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F2FF] text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#6D4AFF]">{t.id}</span>
                        <span className="text-xs font-medium text-[#1E293B] truncate">{t.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Assigned to: {t.assignee}</p>
                    </div>
                    <Badge color="purple" className="shrink-0">{t.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bug Matches */}
          {matchBugs.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#6D4AFF] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Bug size={12} /> Defects & Bugs ({matchBugs.length})
              </p>
              <div className="space-y-1">
                {matchBugs.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect('/bugs')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F2FF] text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-red-500">{b.id}</span>
                        <span className="text-xs font-medium text-[#1E293B] truncate">{b.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{b.environment} &bull; {b.status}</p>
                    </div>
                    <Badge color={b.severity === 'Critical' ? 'red' : 'amber'} className="shrink-0">{b.severity}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Team Matches */}
          {matchTeam.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-[#6D4AFF] uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Users size={12} /> Team Members ({matchTeam.length})
              </p>
              <div className="space-y-1">
                {matchTeam.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleSelect('/team')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F2FF] text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-medium text-[#1E293B]">{m.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.role} &bull; {m.department}</p>
                    </div>
                    <Badge color="purple" className="shrink-0">{m.status}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#EDE8FA] flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with click or arrow keys</span>
          <span className="flex items-center gap-1 text-[#6D4AFF] font-medium">
            Jump to module <ArrowRight size={11} />
          </span>
        </div>
      </motion.div>
    </div>
  )
}
