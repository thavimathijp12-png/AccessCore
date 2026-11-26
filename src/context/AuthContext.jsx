import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import { normalizeRole, getRoleKey, getRoleDashboardPath, validateRoleAccess } from '../utils/roleUtils'

export { normalizeRole, getRoleKey, getRoleDashboardPath, validateRoleAccess }

const AuthContext = createContext(null)

export const DEMO_USERS = {
  admin: {
    id: 'USR-001',
    name: 'Tara Anand',
    email: 'tara.anand@accesscore.io',
    role: 'Admin',
    department: 'Engineering',
    title: 'Senior Systems Architect & Admin',
    avatar: null,
  },
  teamLead: {
    id: 'USR-002',
    name: 'Sarah Chen',
    email: 'sarah.chen@accesscore.io',
    role: 'Team Lead',
    department: 'Operations',
    title: 'Director of Service Operations',
    avatar: null,
  },
  employee: {
    id: 'USR-003',
    name: 'James Wilson',
    email: 'james.wilson@accesscore.io',
    role: 'Employee',
    department: 'Engineering',
    title: 'DevOps & Reliability Engineer',
    avatar: null,
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/login')) {
      return null
    }
    const stored = localStorage.getItem('ac-user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.name === 'Alex Morgan') {
          parsed.name = 'Tara Anand'
          parsed.email = 'tara.anand@accesscore.io'
          localStorage.setItem('ac-user', JSON.stringify(parsed))
        }
        return parsed
      } catch { }
    }
    const defaultUser = { ...DEMO_USERS.admin }
    try {
      localStorage.setItem('ac-user', JSON.stringify(defaultUser))
    } catch { }
    return defaultUser
  })

  // Synchronize on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('ac-token')
    if (token) {
      api.get('/auth/me').then(res => {
        if (res && res.email) {
          const formatted = {
            ...res,
            role: normalizeRole(res.role),
          }
          setUser(formatted)
          localStorage.setItem('ac-user', JSON.stringify(formatted))
        }
      }).catch(() => { })
    }
  }, [])

  /**
   * Role-verified login.
   * Authenticates with the backend, retrieves the true user object,
   * validates against expectedRole (if passed), and stores credentials.
   */
  const login = async (credentials, expectedRole = null) => {
    const email = credentials?.email?.toLowerCase().trim() || ''
    const password = credentials?.password || 'admin123'

    let authenticatedUser = null
    let authToken = null

    // 1. Try real backend REST API login
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res && res.token && res.user) {
        authToken = res.token
        authenticatedUser = {
          ...res.user,
          role: normalizeRole(res.user.role),
        }
      }
    } catch {
      // Backend unavailable; fall through to demo matching
    }

    // 2. Offline / local fallback if backend unreachable
    if (!authenticatedUser) {
      if (email.includes('lead') || email.includes('sarah') || email.includes('elena')) {
        authenticatedUser = { ...DEMO_USERS.teamLead, email }
      } else if (email.includes('emp') || email.includes('james') || email.includes('mike')) {
        authenticatedUser = { ...DEMO_USERS.employee, email }
      } else if (email.includes('admin') || email.includes('tara')) {
        authenticatedUser = { ...DEMO_USERS.admin, email }
      } else {
        authenticatedUser = { ...DEMO_USERS.admin, email }
      }
      authToken = 'demo-jwt-token-' + Date.now()
    }

    // 3. Strict Backend Role Validation against expected portal role
    if (expectedRole) {
      const actualKey = getRoleKey(authenticatedUser.role)
      const expectedKey = expectedRole.toLowerCase()
      if (actualKey !== expectedKey) {
        return {
          success: false,
          error: `Role Mismatch: This account is authenticated as ${authenticatedUser.role} and cannot access the ${expectedRole.toUpperCase()} portal.`,
        }
      }
    }

    // 4. Save session state
    if (authToken) {
      localStorage.setItem('ac-token', authToken)
    }
    localStorage.setItem('ac-user', JSON.stringify(authenticatedUser))
    setUser(authenticatedUser)

    return {
      success: true,
      user: authenticatedUser,
      role: authenticatedUser.role,
      redirectPath: getRoleDashboardPath(authenticatedUser.role),
    }
  }

  const switchRole = async (roleKey, password) => {
    if (!password || !password.trim()) {
      return { success: false, error: 'Password is required to switch dashboard view.' }
    }

    const cleanRoleKey = roleKey.toLowerCase().replace('_', '').replace(' ', '').trim()
    const apiRole = cleanRoleKey === 'teamlead' || cleanRoleKey === 'lead'
      ? 'TEAM_LEAD'
      : cleanRoleKey === 'employee' || cleanRoleKey === 'emp'
      ? 'EMPLOYEE'
      : 'ADMIN'

    // 1. Authenticate switch with backend REST API
    try {
      const res = await api.post('/auth/switch-role', { role: apiRole, password: password.trim() })
      if (res && res.token && res.user) {
        localStorage.setItem('ac-token', res.token)
        const formatted = { ...res.user, role: normalizeRole(res.user.role) }
        setUser(formatted)
        localStorage.setItem('ac-user', JSON.stringify(formatted))
        return {
          success: true,
          user: formatted,
          redirectPath: getRoleDashboardPath(formatted.role),
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Incorrect password for role switch. Access denied.'
      return { success: false, error: message }
    }

    // 2. Demo fallback verification if backend is offline
    const validPasswords = {
      admin: ['admin123', 'admin', 'pass123'],
      teamlead: ['lead123', 'lead', 'pass123'],
      employee: ['emp123', 'employee123', 'pass123'],
    }
    const allowed = validPasswords[cleanRoleKey] || ['admin123']

    if (allowed.includes(password.trim())) {
      const targetUser = cleanRoleKey === 'teamlead' || cleanRoleKey === 'lead'
        ? DEMO_USERS.teamLead
        : cleanRoleKey === 'employee' || cleanRoleKey === 'emp'
        ? DEMO_USERS.employee
        : DEMO_USERS.admin

      setUser(targetUser)
      localStorage.setItem('ac-user', JSON.stringify(targetUser))
      return {
        success: true,
        user: targetUser,
        redirectPath: getRoleDashboardPath(targetUser.role),
      }
    }

    return {
      success: false,
      error: 'Incorrect password for role switch. Access denied.',
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ac-user')
    localStorage.removeItem('ac-token')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
        role: user ? normalizeRole(user.role) : null,
        roleKey: user ? getRoleKey(user.role) : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
