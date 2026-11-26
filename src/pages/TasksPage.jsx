import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, Search, Kanban, List,
  Calendar,
  Edit, Trash2, ArrowRight, MessageSquare
} from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'
import { useTasks } from '../context/TasksContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'
import {
  TASK_STATUSES, TASK_STATUS_LABELS, TASK_STATUS_COLORS,
  TASK_PRIORITIES, TASK_PRIORITY_COLORS, TASK_TRANSITIONS
} from '../data/tasksData'
import { formatDate } from '../utils/helpers'

export default function TasksPage() {
  const { tasks, createTask, updateTask, changeTaskStatus, deleteTask, addComment, toggleSubtask } = useTasks()
  const { toasts, toast, dismiss } = useToast()
  const location = useLocation()

  const [viewMode, setViewMode] = useState('kanban') // 'kanban' | 'list'
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  useEffect(() => {
    if (location.pathname === '/lead/assign-task') {
      setCreateModalOpen(true)
    }
  }, [location.pathname])
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newComment, setNewComment] = useState('')

  // Form State
  const [formData, setFormData] = useState(() => ({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: 'James Wilson',
    department: 'Engineering',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  }))

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.id.toLowerCase().includes(search.toLowerCase()) ||
        task.assignee.toLowerCase().includes(search.toLowerCase())
      const matchPriority = priorityFilter ? task.priority === priorityFilter : true
      const matchStatus = statusFilter ? task.status === statusFilter : true
      return matchSearch && matchPriority && matchStatus
    })
  }, [tasks, search, priorityFilter, statusFilter])

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Task title is required')
      return
    }
    createTask(formData)
    toast.success('Task created successfully')
    setCreateModalOpen(false)
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      assignee: 'James Wilson',
      department: 'Engineering',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    })
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (!editingTask.title.trim()) {
      toast.error('Task title is required')
      return
    }
    updateTask(editingTask.id, editingTask)
    toast.success('Task updated successfully')
    setEditingTask(null)
    if (selectedTask?.id === editingTask.id) {
      setSelectedTask(editingTask)
    }
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedTask) return
    addComment(selectedTask.id, newComment.trim())
    setNewComment('')
    toast.success('Comment added to task')
    // refresh selected task
    const updated = tasks.find(t => t.id === selectedTask.id)
    if (updated) setSelectedTask(updated)
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
            Task Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Coordinate cross-functional initiatives, engineering tasks and operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white border border-[#EDE8FA] rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#6D4AFF] text-white shadow-xs'
                  : 'text-slate-600  hover:text-slate-900'
              }`}
            >
              <Kanban size={13} /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#6D4AFF] text-white shadow-xs'
                  : 'text-slate-600  hover:text-slate-900'
              }`}
            >
              <List size={13} /> List
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus size={14} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#EDE8FA] shadow-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, ID, assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-[#EDE8FA] bg-slate-50 text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 px-2.5 text-xs rounded-lg border border-[#EDE8FA] bg-white text-slate-700 focus:outline-none"
          >
            <option value="">All Priorities</option>
            {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {viewMode === 'list' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 text-xs rounded-lg border border-[#EDE8FA] bg-white text-slate-700 focus:outline-none"
            >
              <option value="">All Statuses</option>
              {TASK_STATUSES.map(s => <option key={s} value={s}>{TASK_STATUS_LABELS[s]}</option>)}
            </select>
          )}

          {(search || priorityFilter || statusFilter) && (
            <button
              onClick={() => { setSearch(''); setPriorityFilter(''); setStatusFilter('') }}
              className="text-xs text-[#6D4AFF] hover:underline px-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* View Rendering */}
      {viewMode === 'kanban' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {TASK_STATUSES.map(statusKey => {
            const columnTasks = filteredTasks.filter(t => t.status === statusKey)
            return (
              <div
                key={statusKey}
                className="rounded-xl border border-[#EDE8FA] bg-[#F8FAFC]/70 p-3 flex flex-col min-h-[480px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {TASK_STATUS_LABELS[statusKey]}
                    </span>
                    <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold bg-white text-slate-600 border border-[#EDE8FA]">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Badge color={TASK_STATUS_COLORS[statusKey]} dot />
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnTasks.map(task => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      whileHover={{ y: -2 }}
                      onClick={() => setSelectedTask(task)}
                      className="p-3.5 rounded-lg bg-white border border-[#EDE8FA] shadow-xs cursor-pointer hover:border-[#A78BFA] transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#6D4AFF]">
                          {task.id}
                        </span>
                        <Badge color={TASK_PRIORITY_COLORS[task.priority]}>
                          {task.priority}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                        {task.title}
                      </h4>

                      {task.subtasks?.length > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Subtasks</span>
                            <span>
                              {task.subtasks.filter(s => s.completed).length} / {task.subtasks.length}
                            </span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#6D4AFF] rounded-full"
                              style={{
                                width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5 truncate max-w-[120px]">
                          <Avatar name={task.assignee} size="xs" />
                          <span className="truncate">{task.assignee}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="h-28 border border-dashed border-[#EDE8FA] rounded-lg flex items-center justify-center text-[11px] text-slate-400">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* List Table View */
        <div className="rounded-xl border border-[#EDE8FA] overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#EDE8FA] text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Task ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map(task => (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#6D4AFF] whitespace-nowrap">
                      {task.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-sm truncate">
                      {task.title}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge color={TASK_STATUS_COLORS[task.status]} dot>
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge color={TASK_PRIORITY_COLORS[task.priority]}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Avatar name={task.assignee} size="xs" />
                        {task.assignee}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {formatDate(task.dueDate)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 rounded text-slate-400 hover:text-[#6D4AFF] transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            deleteTask(task.id)
                            if (selectedTask?.id === task.id) setSelectedTask(null)
                            toast.info(`Task ${task.id} removed`)
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <Modal
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title={`Task Details — ${selectedTask.id}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              {/* Allowed Status Transition Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Advance to:</span>
                {(TASK_TRANSITIONS[selectedTask.status] || []).map(nextStatus => (
                  <Button
                    key={nextStatus}
                    size="xs"
                    variant="outline"
                    iconRight={<ArrowRight size={11} />}
                    onClick={() => {
                      changeTaskStatus(selectedTask.id, nextStatus)
                      toast.success(`Moved to ${TASK_STATUS_LABELS[nextStatus]}`)
                      setSelectedTask(prev => ({ ...prev, status: nextStatus }))
                    }}
                  >
                    {TASK_STATUS_LABELS[nextStatus]}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditingTask(selectedTask)
                    setSelectedTask(null)
                  }}
                >
                  Edit Task
                </Button>
                <Button size="sm" variant="primary" onClick={() => setSelectedTask(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge color={TASK_STATUS_COLORS[selectedTask.status]} dot>
                  {TASK_STATUS_LABELS[selectedTask.status]}
                </Badge>
                <Badge color={TASK_PRIORITY_COLORS[selectedTask.priority]}>
                  {selectedTask.priority} Priority
                </Badge>
                <span className="text-xs text-slate-400">• {selectedTask.department}</span>
              </div>
              <h3 className="text-sm font-semibold text-[#1E293B]">
                {selectedTask.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {selectedTask.description || 'No description provided.'}
              </p>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Assignee</span>
                <span className="font-medium text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <Avatar name={selectedTask.assignee} size="xs" />
                  {selectedTask.assignee}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Reporter</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {selectedTask.reporter}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Due Date</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {formatDate(selectedTask.dueDate)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Created</span>
                <span className="font-medium text-slate-800 mt-0.5 block">
                  {formatDate(selectedTask.createdAt)}
                </span>
              </div>
            </div>

            {/* Checklist subtasks */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">
                Execution Checklist ({selectedTask.subtasks?.filter(s => s.completed).length || 0} / {selectedTask.subtasks?.length || 0})
              </h4>
              <div className="space-y-1.5">
                {(selectedTask.subtasks || []).map(sub => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => {
                        toggleSubtask(selectedTask.id, sub.id)
                        setSelectedTask(prev => ({
                          ...prev,
                          subtasks: prev.subtasks.map(s => s.id === sub.id ? { ...s, completed: !s.completed } : s)
                        }))
                      }}
                      className="rounded border-slate-300 text-[#6D4AFF] focus:ring-[#6D4AFF] h-3.5 w-3.5"
                    />
                    <span className={`text-xs ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 '}`}>
                      {sub.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Comments Stream */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <MessageSquare size={13} /> Activity & Comments ({selectedTask.comments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto mb-3">
                {(selectedTask.comments || []).map(comm => (
                  <div key={comm.id} className="p-2.5 rounded-lg bg-slate-50 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-semibold text-slate-700">{comm.author}</span>
                      <span>{formatDate(comm.date)}</span>
                    </div>
                    <p className="text-slate-600">{comm.text}</p>
                  </div>
                ))}
                {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No notes posted yet.</p>
                )}
              </div>

              {/* Add comment */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Post an operational update..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 h-8 px-3 rounded-lg border border-[#EDE8FA] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
                />
                <Button size="sm" type="submit" disabled={!newComment.trim()}>
                  Post
                </Button>
              </form>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Task Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Operational Task"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <Input
            label="Task Title *"
            placeholder="e.g. Upgrade PostgreSQL staging cluster"
            value={formData.title}
            onChange={(e) => setFormData(f => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Detailed acceptance criteria or implementation plan..."
              value={formData.description}
              onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#EDE8FA] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(f => ({ ...f, priority: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Assignee</label>
              <select
                value={formData.assignee}
                onChange={(e) => setFormData(f => ({ ...f, assignee: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                <option value="James Wilson">James Wilson</option>
                <option value="Sarah Chen">Sarah Chen</option>
                <option value="Mike Torres">Mike Torres</option>
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="Tara Anand">Tara Anand</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData(f => ({ ...f, department: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Security">Security</option>
                <option value="Product">Product</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      {editingTask && (
        <Modal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          title={`Edit Task — ${editingTask.id}`}
          size="md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-3.5">
            <Input
              label="Task Title *"
              value={editingTask.title}
              onChange={(e) => setEditingTask(t => ({ ...t, title: e.target.value }))}
              fullWidth
            />
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editingTask.description}
                onChange={(e) => setEditingTask(t => ({ ...t, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#EDE8FA] bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#6D4AFF]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask(t => ({ ...t, priority: e.target.value }))}
                  className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
                >
                  {TASK_PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Assignee</label>
                <select
                  value={editingTask.assignee}
                  onChange={(e) => setEditingTask(t => ({ ...t, assignee: e.target.value }))}
                  className="w-full h-9 px-2 text-xs rounded-lg border border-[#EDE8FA] bg-white"
                >
                  <option value="James Wilson">James Wilson</option>
                  <option value="Sarah Chen">Sarah Chen</option>
                  <option value="Mike Torres">Mike Torres</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="Tara Anand">Tara Anand</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingTask(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Update Task
              </Button>
            </div>
          </form>
        </Modal>
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
