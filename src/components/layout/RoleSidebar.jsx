import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  Bug,
  CheckCircle,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  PlusCircle,
  User,
  Shield,
  Briefcase
} from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { cn } from '../../utils/helpers'
import AccessCoreLogo from '../common/AccessCoreLogo'

export const ADMIN_NAV_GROUPS = [
  {
    group: 'Executive Overview',
    items: [
      { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Identity & Access',
    items: [
      { label: 'User Management', path: '/admin/users', icon: UserCheck },
      { label: 'Role Management', path: '/admin/roles', icon: ShieldCheck },
      { label: 'Team Management', path: '/admin/team', icon: Users },
    ],
  },
  {
    group: 'Operations Governance',
    items: [
      { label: 'All Requests', path: '/admin/requests', icon: ClipboardList },
      { label: 'Task Management', path: '/admin/tasks', icon: CheckSquare },
      { label: 'Bug Reports', path: '/admin/bugs', icon: Bug },
      { label: 'Approvals', path: '/admin/approvals', icon: CheckCircle },
    ],
  },
  {
    group: 'Intelligence & System',
    items: [
      { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
      { label: 'Notifications', path: '/admin/notifications', icon: Bell },
      { label: 'System Settings', path: '/admin/settings', icon: Settings },
      { label: 'My Profile', path: '/admin/profile', icon: User },
    ],
  },
]

export const LEAD_NAV_GROUPS = [
  {
    group: 'Operations Center',
    items: [
      { label: 'Overview', path: '/lead/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Team Supervision',
    items: [
      { label: 'My Team', path: '/lead/team', icon: Users },
      { label: 'Team Members', path: '/lead/members', icon: UserCheck },
      { label: 'Team Tasks', path: '/lead/tasks', icon: CheckSquare },
      { label: 'Assign Tasks', path: '/lead/assign-task', icon: PlusCircle },
    ],
  },
  {
    group: 'Workflow Queue',
    items: [
      { label: 'Service Requests', path: '/lead/requests', icon: ClipboardList },
      { label: 'Bug Tracking', path: '/lead/bugs', icon: Bug },
      { label: 'Approvals', path: '/lead/approvals', icon: CheckCircle },
      { label: 'Team Performance', path: '/lead/performance', icon: TrendingUp },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Notifications', path: '/lead/notifications', icon: Bell },
      { label: 'My Profile', path: '/lead/profile', icon: User },
    ],
  },
]

export const EMPLOYEE_NAV_GROUPS = [
  {
    group: 'Workspace',
    items: [
      { label: 'Overview', path: '/employee/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'My Work',
    items: [
      { label: 'My Tasks', path: '/employee/tasks', icon: CheckSquare },
      { label: 'My Requests', path: '/employee/requests', icon: ClipboardList },
      { label: 'My Progress', path: '/employee/progress', icon: BarChart3 },
    ],
  },
  {
    group: 'Quick Actions',
    items: [
      { label: 'Create Request', path: '/employee/new-request', icon: PlusCircle },
      { label: 'Report a Bug', path: '/employee/new-bug', icon: Bug },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Notifications', path: '/employee/notifications', icon: Bell },
      { label: 'My Profile', path: '/employee/profile', icon: User },
    ],
  },
]

export default function RoleSidebar({ role = 'admin', mobileOpen = false, onCloseMobile }) {
  const [collapsed, setCollapsed] = useLocalStorage('ac-sidebar-collapsed', false)
  const isMobile = useIsMobile(768)
  const location = useLocation()
  const { user } = useAuth()

  const normalizedRole = (role || 'admin').toLowerCase()
  const navGroups =
    normalizedRole === 'admin'
      ? ADMIN_NAV_GROUPS
      : normalizedRole === 'lead' || normalizedRole === 'team_lead'
      ? LEAD_NAV_GROUPS
      : EMPLOYEE_NAV_GROUPS

  const roleLabel =
    normalizedRole === 'admin'
      ? 'Admin'
      : normalizedRole === 'lead' || normalizedRole === 'team_lead'
      ? 'Team Lead'
      : 'Employee'

  const badgeColor =
    normalizedRole === 'admin'
      ? 'bg-[#6D4AFF]/20 text-[#A78BFA] border-[#6D4AFF]/40'
      : normalizedRole === 'lead' || normalizedRole === 'team_lead'
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
      : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <motion.aside
        animate={{
          width: isMobile ? 240 : (collapsed ? 68 : 240),
          x: isMobile ? (mobileOpen ? 0 : -260) : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full z-40 md:z-30 flex flex-col',
          'bg-[#11111B] border-r border-[#1E1B2E]',
          'overflow-hidden shrink-0 shadow-xl md:shadow-none',
          !mobileOpen && 'hidden md:flex'
        )}
      >
        {/* Official Logo Header */}
        <div className={cn(
          'flex items-center justify-between px-3.5 border-b border-[#1E1B2E] relative z-10',
          'h-[60px] shrink-0 bg-[#11111B]'
        )}>
          <div className="flex items-center gap-2 overflow-hidden">
            <AccessCoreLogo
              collapsed={collapsed && !mobileOpen}
              showText={!collapsed || mobileOpen}
              theme="dark"
              size="sm"
            />
          </div>

          {/* Close button on mobile */}
          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#1E1B2E]"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Role Portal Badge Header */}
        {(!collapsed || mobileOpen) && (
          <div className="px-4 py-2.5 bg-[#171523] border-b border-[#1E1B2E] flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#94A3B8]">
              Portal Mode
            </span>
            <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', badgeColor)}>
              {roleLabel}
            </span>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-2.5 py-3 space-y-4 overflow-y-auto overflow-x-hidden scrollbar-none">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-0.5">
              {(!collapsed || mobileOpen) && (
                <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-[#64748B]/80 select-none">
                  {group.group}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => isMobile && onCloseMobile && onCloseMobile()}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all group relative',
                      isActive
                        ? 'bg-[#6D4AFF] text-white font-semibold shadow-[0_2px_10px_rgba(109,74,255,0.4)]'
                        : 'text-[#94A3B8] hover:text-white hover:bg-[#1E1B2E]'
                    )}
                    title={collapsed && !mobileOpen ? item.label : undefined}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        'shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'
                      )}
                    />
                    {(!collapsed || mobileOpen) && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {isActive && (
                      <span className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Bottom User Persona Banner */}
        <div className="p-2.5 border-t border-[#1E1B2E] bg-[#11111B]/80">
          <div className={cn(
            'flex items-center gap-2.5 p-2 rounded-xl bg-[#171523] border border-[#1E1B2E]',
            collapsed && !mobileOpen ? 'justify-center p-1.5' : ''
          )}>
            <Avatar name={user?.name || 'User'} size="sm" />
            {(!collapsed || mobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.name || 'Tara Anand'}
                </p>
                <p className="text-[10px] text-[#A78BFA] truncate">
                  {user?.role || roleLabel}
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="mt-2 w-full flex items-center justify-center p-1.5 text-[#94A3B8] hover:text-white hover:bg-[#1E1B2E] rounded-lg transition-colors cursor-pointer"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          )}
        </div>
      </motion.aside>
    </>
  )
}
