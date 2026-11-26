import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getRoleDashboardPath, isRouteAllowedForRole } from '../../utils/roleUtils'

export { getRoleDashboardPath }

export default function RoleBasedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  const isAllowed = isRouteAllowedForRole(user.role, allowedRoles)

  if (!isAllowed) {
    // Redirect unauthorized user directly to their own dedicated dashboard
    return <Navigate to={getRoleDashboardPath(user.role)} replace />
  }

  return children
}
