import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_BUGS, BUG_TRANSITIONS } from '../data/bugsData'
import { api } from '../utils/api'

const BugsContext = createContext(null)

let nextBugId = DEMO_BUGS.length + 2001

function mapApiBug(b) {
  return {
    id: b.bugCode || b.id,
    title: b.title,
    severity: b.severity || 'Medium',
    status: b.status || 'OPEN',
    environment: b.environment || 'Production',
    assignedTo: b.assignedTo || null,
    reportedBy: b.reportedBy || 'Tara Anand',
    reproductionSteps: b.reproductionSteps || '',
    expectedResult: b.expectedResult || '',
    actualResult: b.actualResult || '',
    createdAt: b.createdAt || new Date().toISOString(),
    updatedAt: b.updatedAt || new Date().toISOString(),
    attachments: b.attachments || [],
    comments: b.comments || [],
  }
}

export function BugsProvider({ children }) {
  const [bugs, setBugs] = useState(() => {
    const saved = localStorage.getItem('ac-bugs')
    return saved ? JSON.parse(saved) : DEMO_BUGS
  })

  // Synchronize with backend API on mount
  useEffect(() => {
    api.get('/bugs').then(res => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapApiBug)
        setBugs(prev => {
          const existingIds = new Set(mapped.map(m => m.id))
          const localOnly = prev.filter(p => !existingIds.has(p.id))
          const merged = [...mapped, ...localOnly]
          localStorage.setItem('ac-bugs', JSON.stringify(merged))
          return merged
        })
      }
    }).catch(() => { })
  }, [])

  const reportBug = useCallback((formData) => {
    const now = new Date().toISOString()
    const newId = `BUG-${nextBugId++}`
    const newBug = {
      id: newId,
      title: formData.title,
      severity: formData.severity || 'Medium',
      status: 'OPEN',
      environment: formData.environment || 'Production',
      assignedTo: formData.assignedTo || null,
      reportedBy: formData.reportedBy || 'Tara Anand',
      reproductionSteps: formData.reproductionSteps || '',
      expectedResult: formData.expectedResult || '',
      actualResult: formData.actualResult || '',
      createdAt: now,
      updatedAt: now,
      attachments: formData.attachments || [],
      comments: [],
    }

    setBugs(prev => {
      const updated = [newBug, ...prev]
      localStorage.setItem('ac-bugs', JSON.stringify(updated))
      return updated
    })

    api.post('/bugs', {
      bugCode: newId,
      title: formData.title,
      severity: formData.severity || 'Medium',
      status: 'OPEN',
      environment: formData.environment || 'Production',
      assignedTo: formData.assignedTo || null,
      reportedBy: formData.reportedBy || 'Tara Anand',
      reproductionSteps: formData.reproductionSteps || '',
      expectedResult: formData.expectedResult || '',
      actualResult: formData.actualResult || '',
    }).catch(() => { })

    return newBug
  }, [])

  const updateBug = useCallback((id, patch) => {
    setBugs(prev => {
      const updated = prev.map(b => (b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b))
      localStorage.setItem('ac-bugs', JSON.stringify(updated))
      return updated
    })
    api.patch(`/bugs/${id}`, patch).catch(() => { })
  }, [])

  const changeBugStatus = useCallback((id, newStatus) => {
    let success = false
    setBugs(prev => {
      const updated = prev.map(b => {
        if (b.id !== id) return b
        const allowed = BUG_TRANSITIONS[b.status] || []
        if (!allowed.includes(newStatus)) return b
        success = true
        return {
          ...b,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      })
      localStorage.setItem('ac-bugs', JSON.stringify(updated))
      return updated
    })

    if (success) {
      api.patch(`/bugs/${id}/status`, { status: newStatus }).catch(() => { })
    }
    return success
  }, [])

  const assignDeveloper = useCallback((id, developerName) => {
    setBugs(prev => {
      const updated = prev.map(b => {
        if (b.id !== id) return b
        return {
          ...b,
          assignedTo: developerName,
          status: b.status === 'OPEN' ? 'ASSIGNED' : b.status,
          updatedAt: new Date().toISOString(),
        }
      })
      localStorage.setItem('ac-bugs', JSON.stringify(updated))
      return updated
    })
    api.patch(`/bugs/${id}`, { assignedTo: developerName }).catch(() => { })
  }, [])

  const addComment = useCallback((id, text, author = 'Tara Anand') => {
    setBugs(prev => {
      const updated = prev.map(b => {
        if (b.id !== id) return b
        const comment = { id: Date.now(), author, text, date: new Date().toISOString() }
        return {
          ...b,
          updatedAt: new Date().toISOString(),
          comments: [...b.comments, comment],
        }
      })
      localStorage.setItem('ac-bugs', JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteBug = useCallback((id) => {
    setBugs(prev => {
      const updated = prev.filter(b => b.id !== id)
      localStorage.setItem('ac-bugs', JSON.stringify(updated))
      return updated
    })
    api.delete(`/bugs/${id}`).catch(() => { })
  }, [])

  return (
    <BugsContext.Provider
      value={{
        bugs,
        reportBug,
        updateBug,
        changeBugStatus,
        assignDeveloper,
        addComment,
        deleteBug,
      }}
    >
      {children}
    </BugsContext.Provider>
  )
}

export function useBugs() {
  const ctx = useContext(BugsContext)
  if (!ctx) throw new Error('useBugs must be used within BugsProvider')
  return ctx
}
