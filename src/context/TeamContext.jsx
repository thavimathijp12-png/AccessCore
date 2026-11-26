import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_TEAM_MEMBERS } from '../data/teamData'
import { api } from '../utils/api'

const TeamContext = createContext(null)

let nextEmpId = DEMO_TEAM_MEMBERS.length + 10

function mapApiMember(m) {
  return {
    id: m.id || m.userCode,
    name: m.name,
    email: m.email,
    role: m.role || 'Employee',
    department: m.department || 'Engineering',
    status: m.status || 'Active',
    phone: m.phone || '+1 (555) 000-0000',
    location: m.location || 'Remote',
    joinDate: m.createdAt || new Date().toISOString(),
    title: m.title || 'Specialist',
    bio: m.bio || 'Enterprise team member.',
    assignedRequests: 0,
    assignedTasks: 0,
    skills: ['AccessCore', 'IT Systems'],
  }
}

export function TeamProvider({ children }) {
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('ac-team')
    return saved ? JSON.parse(saved) : DEMO_TEAM_MEMBERS
  })

  // Synchronize on mount
  useEffect(() => {
    api.get('/team').then(res => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapApiMember)
        setMembers(prev => {
          const existingIds = new Set(mapped.map(m => m.id))
          const localOnly = prev.filter(p => !existingIds.has(p.id))
          const merged = [...mapped, ...localOnly]
          localStorage.setItem('ac-team', JSON.stringify(merged))
          return merged
        })
      }
    }).catch(() => {})
  }, [])

  const addMember = useCallback((formData) => {
    const now = new Date().toISOString()
    const newMember = {
      id: `USR-${String(nextEmpId++).padStart(3, '0')}`,
      name: formData.name,
      email: formData.email,
      role: formData.role || 'Employee',
      department: formData.department || 'Engineering',
      status: formData.status || 'Active',
      phone: formData.phone || '+1 (555) 000-0000',
      location: formData.location || 'Remote',
      joinDate: now,
      title: formData.title || 'Specialist',
      bio: formData.bio || 'Enterprise team member.',
      assignedRequests: 0,
      assignedTasks: 0,
      skills: formData.skills || ['AccessCore', 'IT Systems'],
    }

    // Call backend API if authenticated as admin
    api.post('/users', {
      userCode: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role.toUpperCase().replace(/\s+/g, '_'),
      department: newMember.department,
      title: newMember.title,
      phone: newMember.phone,
      location: newMember.location,
      bio: newMember.bio,
      status: newMember.status,
    }).catch(() => {})

    setMembers(prev => {
      const updated = [newMember, ...prev]
      localStorage.setItem('ac-team', JSON.stringify(updated))
      return updated
    })
    return newMember
  }, [])

  const updateMember = useCallback((id, patch) => {
    api.patch(`/users/${id}`, patch).catch(() => {})
    setMembers(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, ...patch } : m))
      localStorage.setItem('ac-team', JSON.stringify(updated))
      return updated
    })
  }, [])

  const toggleMemberStatus = useCallback((id) => {
    setMembers(prev => {
      const member = prev.find(m => m.id === id)
      const nextStatus = member?.status === 'Active' ? 'Inactive' : 'Active'
      api.patch(`/users/${id}/status`, { status: nextStatus }).catch(() => {})

      const updated = prev.map(m =>
        m.id === id ? { ...m, status: nextStatus } : m
      )
      localStorage.setItem('ac-team', JSON.stringify(updated))
      return updated
    })
  }, [])

  const deleteMember = useCallback((id) => {
    api.delete(`/users/${id}`).catch(() => {})
    setMembers(prev => {
      const updated = prev.filter(m => m.id !== id)
      localStorage.setItem('ac-team', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <TeamContext.Provider
      value={{
        members,
        addMember,
        updateMember,
        toggleMemberStatus,
        deleteMember,
      }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const ctx = useContext(TeamContext)
  if (!ctx) throw new Error('useTeam must be used within TeamProvider')
  return ctx
}
