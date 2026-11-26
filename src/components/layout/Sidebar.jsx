import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { cn } from '../../utils/helpers'
import AccessCoreLogo from '../common/AccessCoreLogo'

const NAV_GROUPS = [
  {
    group: 'Operations',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard },
      { label: 'My Requests', path: '/requests', icon: ClipboardList },
      { label: 'Tasks', path: '/tasks', icon: CheckSquare },
      { label: 'Bug Tracking', path: '/bugs', icon: Bug },
      { label: 'Approvals', path: '/approvals', icon: CheckCircle },
    ],
  },
  {
    group: 'Organization',
    items: [
      { label: 'Team', path: '/team', icon: Users },
      { label: 'Reports', path: '/reports', icon: BarChart3 },
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'Settings', path: '/settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const [collapsed, setCollapsed] = useLocalStorage('ac-sidebar-collapsed', false)
  const isMobile = useIsMobile(768)
  const location = useLocation()
  const { user } = useAuth()

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

        {/* Navigation items grouped */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden relative z-10">
          {NAV_GROUPS.map((grp, gIdx) => (
            <div key={grp.group} className={cn('mb-3', gIdx > 0 && 'pt-2')}>
              {(!collapsed || mobileOpen) && (
                <p className="px-4 pb-1.5 text-[10px] font-bold tracking-wider uppercase text-[#64748B] select-none">
                  {grp.group}
                </p>
              )}
              {collapsed && !mobileOpen && gIdx > 0 && (
                <div className="mx-3 my-1.5 border-t border-[#1E1B2E]" />
              )}
              <ul className="space-y-0.5 px-2.5">
                {grp.items.map(({ label, path, icon: Icon }) => {
                  const isActive =
                    path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(path)

                  return (
                    <li key={path}>
                      <NavLink
                        to={path}
                        onClick={() => {
                          if (onCloseMobile) onCloseMobile()
                        }}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-xl',
                          'text-sm font-medium transition-all duration-150',
                          'relative group select-none',
                          isActive
                            ? 'bg-[#6D4AFF] text-white font-semibold shadow-xs shadow-[#6D4AFF]/30'
                            : 'text-[#CBD5E1] hover:text-white hover:bg-[#1E1B2E]'
                        )}
                      >
                        <Icon
                          size={18}
                          className={cn(
                            'shrink-0 transition-colors',
                            isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-[#A78BFA]'
                          )}
                        />
                        <AnimatePresence>
                          {(!collapsed || mobileOpen) && (
                            <motion.span
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -6 }}
                              transition={{ duration: 0.15 }}
                              className="whitespace-nowrap truncate"
                            >
                              {label}
                            </motion.span>
                          )}
                        </AnimatePresence>

                        {/* Tooltip for desktop collapsed */}
                        {collapsed && !mobileOpen && (
                          <span className={cn(
                            'absolute left-full ml-3 px-2.5 py-1 rounded-md z-50',
                            'bg-[#181824] text-white text-xs whitespace-nowrap font-medium',
                            'opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none',
                            'border border-[#232136] shadow-lg'
                          )}>
                            {label}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile & Collapse toggle bottom section */}
        <div className="p-2.5 border-t border-[#1E1B2E] relative z-10 bg-[#11111B]">
          {(!collapsed || mobileOpen) ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#181824] border border-[#232136] mb-2 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <Avatar name={user?.name || 'Tara Anand'} size="sm" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#181824]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {user?.name || 'Tara Anand'}
                  </p>
                  <p className="text-[10px] text-[#A78BFA] truncate">
                    {user?.role || 'Admin'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Desktop Collapse toggle button */}
          <div className="hidden md:block">
            <button
              onClick={() => setCollapsed(c => !c)}
              className={cn(
                'flex items-center justify-center gap-2 w-full px-3 py-1.5 rounded-lg',
                'text-[#94A3B8] hover:text-white hover:bg-[#1E1B2E]',
                'text-xs transition-colors duration-150 cursor-pointer'
              )}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight size={16} className="text-[#A78BFA]" />
              ) : (
                <>
                  <ChevronLeft size={16} className="text-[#A78BFA]" />
                  <span>Collapse navigation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
