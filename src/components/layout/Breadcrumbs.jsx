import { useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const ROUTE_LABELS = {
  admin: 'Admin Portal',
  lead: 'Lead Portal',
  employee: 'Employee Portal',
  dashboard: 'Overview',
  requests: 'Service Requests',
  tasks: 'Task Management',
  bugs: 'Bug Tracking',
  approvals: 'Approvals',
  team: 'Team Management',
  users: 'User Directory',
  roles: 'Role Permissions',
  members: 'Team Members',
  performance: 'Team Performance',
  progress: 'My Progress',
  reports: 'Reports & Analytics',
  notifications: 'Notifications',
  settings: 'System Settings',
  profile: 'My Profile',
  'assign-task': 'Assign Task',
  'new-request': 'New Service Request',
  'new-bug': 'Report Defect',
}

export default function Breadcrumbs() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)

  if (pathnames.length === 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
        <Home size={13} className="text-[#6D4AFF]" />
        <span className="font-semibold text-[#1E1B2E]">Dashboard</span>
      </div>
    )
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#64748B] mb-4">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[#6D4AFF] transition-colors"
      >
        <Home size={13} />
        <span>Dashboard</span>
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const label = ROUTE_LABELS[value] || value.charAt(0).toUpperCase() + value.slice(1)

        return (
          <span key={to} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-[#A78BFA]" />
            {isLast ? (
              <span className="font-semibold text-[#1E1B2E]">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-[#6D4AFF] transition-colors"
              >
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
