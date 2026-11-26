import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_TASKS, TASK_TRANSITIONS } from '../data/tasksData'
import { api } from '../utils/api'

const TasksContext = createContext(null)

let nextTaskId = DEMO_TASKS.length + 1001

function mapApiTask(t) {
  return {
    id: t.taskCode || t.id,
    title: t.title,
    description: t.description || '',
    status: t.status || 'TODO',
    priority: t.priority || 'Medium',
    assignee: t.assignee || 'Unassigned',
    reporter: t.reporter || 'Tara Anand',
    department: t.department || 'Engineering',
    dueDate: t.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || new Date().toISOString(),
    subtasks: t.subtasks || [],
    comments: t.comments || [],
  }
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('ac-tasks')
    return saved ? JSON.parse(saved) : DEMO_TASKS
  })

  // Synchronize with backend API on mount
  useEffect(() => {
    api.get('/tasks').then(res => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapApiTask)
        setTasks(prev => {
          const existingIds = new Set(mapped.map(m => m.id))
          const localOnly = prev.filter(p => !existingIds.has(p.id))
          const merged = [...mapped, ...localOnly]
          localStorage.setItem('ac-tasks', JSON.stringify(merged))
          return merged
        })
      }
    }).catch(() => { })
  }, [])

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('ac-tasks', JSON.stringify(tasks))
  }, [tasks])

  const createTask = useCallback((formData) => {
    const now = new Date().toISOString()
    const newId = `TSK-${nextTaskId++}`
    const newTask = {
      id: newId,
      title: formData.title,
      description: formData.description || '',
      status: 'TODO',
      priority: formData.priority || 'Medium',
      assignee: formData.assignee || 'Unassigned',
      reporter: formData.reporter || 'Tara Anand',
      department: formData.department || 'Engineering',
      dueDate: formData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: now,
      updatedAt: now,
      subtasks: formData.subtasks || [],
      comments: [],
    }

    setTasks(prev => {
      const updated = [newTask, ...prev]
      localStorage.setItem('ac-tasks', JSON.stringify(updated))
      return updated
    })

    api.post('/tasks', {
      taskCode: newId,
      title: formData.title,
      description: formData.description || '',
      status: 'TODO',
      priority: formData.priority || 'Medium',
      assignee: formData.assignee || 'Unassigned',
      reporter: formData.reporter || 'Tara Anand',
      department: formData.department || 'Engineering',
      dueDate: formData.dueDate,
    }).catch(() => { })

    return newTask
  }, [])

  const updateTask = useCallback((id, patch) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t))
      localStorage.setItem('ac-tasks', JSON.stringify(updated))
      return updated
    })
    api.patch(`/tasks/${id}`, patch).catch(() => { })
  }, [])

  const changeTaskStatus = useCallback((id, newStatus) => {
    let success = false
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== id) return t
        const allowed = TASK_TRANSITIONS[t.status] || []
        if (!allowed.includes(newStatus)) return t
        success = true
        return {
          ...t,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      })
      localStorage.setItem('ac-tasks', JSON.stringify(updated))
      return updated
    })

    if (success) {
      api.patch(`/tasks/${id}/status`, { status: newStatus }).catch(() => { })
    }
    return success
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id)
      localStorage.setItem('ac-tasks', JSON.stringify(updated))
      return updated
    })
    api.delete(`/tasks/${id}`).catch(() => { })
  }, [])

  const addComment = useCallback((id, text, author = 'Tara Anand') => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== id) return t
        const comment = { id: Date.now(), author, text, date: new Date().toISOString() }
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          comments: [...t.comments, comment],
        }
      })
      localStorage.setItem('ac-tasks', JSON.stringify(updated))
      return updated
    })
  }, [])

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id !== taskId) return t
        const subtasks = t.subtasks.map(s => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
        return { ...t, subtasks, updatedAt: new Date().toISOString() }
      })
      localStorage.setItem('ac-tasks', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        changeTaskStatus,
        deleteTask,
        addComment,
        toggleSubtask,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}
