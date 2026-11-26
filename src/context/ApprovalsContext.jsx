import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_APPROVALS } from '../data/approvalsData'
import { api } from '../utils/api'

const ApprovalsContext = createContext(null)

let nextAprId = DEMO_APPROVALS.length + 3001

function mapApiApproval(a) {
  return {
    id: a.approvalCode || a.id,
    title: a.title,
    type: a.type || 'Equipment & Hardware',
    requestor: a.requestor || 'Tara Anand',
    department: a.department || 'Engineering',
    amountOrDetails: a.amountOrDetails || 'Standard Request',
    priority: a.priority || 'Medium',
    status: a.status || 'PENDING',
    justification: a.justification || '',
    submittedDate: a.submittedDate || a.createdAt || new Date().toISOString(),
    decisionDate: a.decisionDate || null,
    approver: a.approver || null,
    rejectionReason: a.rejectionReason || null,
    history: a.history || [
      {
        id: 1,
        action: 'Submitted',
        actor: a.requestor || 'Tara Anand',
        note: 'Approval workflow initiated.',
        date: a.submittedDate || a.createdAt || new Date().toISOString(),
      },
    ],
  }
}

export function ApprovalsProvider({ children }) {
  const [approvals, setApprovals] = useState(() => {
    const saved = localStorage.getItem('ac-approvals')
    return saved ? JSON.parse(saved) : DEMO_APPROVALS
  })

  // Synchronize with backend API on mount
  useEffect(() => {
    api.get('/approvals').then(res => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapApiApproval)
        setApprovals(prev => {
          const existingIds = new Set(mapped.map(m => m.id))
          const localOnly = prev.filter(p => !existingIds.has(p.id))
          const merged = [...mapped, ...localOnly]
          localStorage.setItem('ac-approvals', JSON.stringify(merged))
          return merged
        })
      }
    }).catch(() => {})
  }, [])

  const approveRequest = useCallback((id, note = '', approver = 'Tara Anand') => {
    setApprovals(prev => {
      const now = new Date().toISOString()
      const updated = prev.map(a => {
        if (a.id !== id) return a
        const historyItem = {
          id: Date.now(),
          action: 'Approved',
          actor: approver,
          note: note || 'Request approved by authorized manager.',
          date: now,
        }
        return {
          ...a,
          status: 'APPROVED',
          decisionDate: now,
          approver,
          rejectionReason: null,
          history: [...(a.history || []), historyItem],
        }
      })
      localStorage.setItem('ac-approvals', JSON.stringify(updated))
      return updated
    })

    api.post(`/approvals/${id}/decision`, {
      decision: 'APPROVED',
      note,
      approver,
    }).catch(() => {})
  }, [])

  const rejectRequest = useCallback((id, reason, approver = 'Tara Anand') => {
    setApprovals(prev => {
      const now = new Date().toISOString()
      const updated = prev.map(a => {
        if (a.id !== id) return a
        const historyItem = {
          id: Date.now(),
          action: 'Rejected',
          actor: approver,
          note: `Rejected: ${reason}`,
          date: now,
        }
        return {
          ...a,
          status: 'REJECTED',
          decisionDate: now,
          approver,
          rejectionReason: reason,
          history: [...(a.history || []), historyItem],
        }
      })
      localStorage.setItem('ac-approvals', JSON.stringify(updated))
      return updated
    })

    api.post(`/approvals/${id}/decision`, {
      decision: 'REJECTED',
      reason,
      approver,
    }).catch(() => {})
  }, [])

  const createApproval = useCallback((formData) => {
    const now = new Date().toISOString()
    const newId = `APR-${nextAprId++}`
    const newApr = {
      id: newId,
      title: formData.title,
      type: formData.type || 'Equipment & Hardware',
      requestor: formData.requestor || 'Tara Anand',
      department: formData.department || 'Engineering',
      amountOrDetails: formData.amountOrDetails || 'Standard Request',
      priority: formData.priority || 'Medium',
      status: 'PENDING',
      justification: formData.justification || '',
      submittedDate: now,
      decisionDate: null,
      approver: null,
      rejectionReason: null,
      history: [
        { id: Date.now(), action: 'Submitted', actor: formData.requestor || 'Tara Anand', note: 'Approval workflow initiated.', date: now },
      ],
    }
    setApprovals(prev => {
      const updated = [newApr, ...prev]
      localStorage.setItem('ac-approvals', JSON.stringify(updated))
      return updated
    })
    return newApr
  }, [])

  return (
    <ApprovalsContext.Provider
      value={{
        approvals,
        approveRequest,
        rejectRequest,
        createApproval,
      }}
    >
      {children}
    </ApprovalsContext.Provider>
  )
}

export function useApprovals() {
  const ctx = useContext(ApprovalsContext)
  if (!ctx) throw new Error('useApprovals must be used within ApprovalsProvider')
  return ctx
}
