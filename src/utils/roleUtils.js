export function normalizeRole(role) {
  if (!role) return 'Admin'
  const r = role.toUpperCase().replace(/\s+/g, '_')
  if (r === 'ADMIN') return 'Admin'
  if (r === 'TEAM_LEAD' || r === 'LEAD') return 'Team Lead'
  if (r === 'EMPLOYEE' || r === 'USER') return 'Employee'
  return role
}

export function getRoleKey(role) {
  const norm = normalizeRole(role)
  if (norm === 'Admin') return 'admin'
  if (norm === 'Team Lead') return 'lead'
  return 'employee'
}

export function getRoleDashboardPath(role) {
  const key = getRoleKey(role)
  if (key === 'admin') return '/admin/dashboard'
  if (key === 'lead') return '/lead/dashboard'
  return '/employee/dashboard'
}

export function validateRoleAccess(userRole, expectedPortalRole) {
  const actualKey = getRoleKey(userRole)
  const expectedKey = (expectedPortalRole || '').toLowerCase()
  if (expectedKey && actualKey !== expectedKey) {
    return {
      allowed: false,
      error: `Role Mismatch: This account is authenticated as ${normalizeRole(userRole)} and cannot access the ${expectedPortalRole.toUpperCase()} portal.`,
    }
  }
  return {
    allowed: true,
    redirectPath: getRoleDashboardPath(userRole),
  }
}

export function isRouteAllowedForRole(userRole, allowedRoles) {
  const userRoleNorm = (userRole || '').toUpperCase().replace(/\s+/g, '_')
  const normalizedAllowed = (allowedRoles || []).map(r => r.toUpperCase().replace(/\s+/g, '_'))
  return normalizedAllowed.some(allowed => {
    if (allowed === 'LEAD' || allowed === 'TEAM_LEAD') {
      return userRoleNorm === 'LEAD' || userRoleNorm === 'TEAM_LEAD'
    }
    return userRoleNorm === allowed
  })
}
