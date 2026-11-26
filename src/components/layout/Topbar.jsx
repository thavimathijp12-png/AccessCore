import { Bell, Search, ChevronDown, Menu, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useIsMobile } from '../../hooks/useIsMobile'
import Avatar from '../ui/Avatar'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/helpers'
import { motion, AnimatePresence } from 'framer-motion'
import GlobalSearchModal from '../common/GlobalSearchModal'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import AccessCoreLogo from '../common/AccessCoreLogo'
import PasswordVerificationModal from '../auth/PasswordVerificationModal'

export default function Topbar({ onToggleMobileSidebar }) {
  const isMobile = useIsMobile(768)
  const { user, logout, switchRole } = useAuth()
  const { unreadCount = 0 } = useNotifications() || {}
  const [sidebarCollapsed] = useLocalStorage('ac-sidebar-collapsed', false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const [switchModalOpen, setSwitchModalOpen] = useState(false)
  const [pendingTargetRole, setPendingTargetRole] = useState(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const getRolePrefix = () => {
    const r = (user?.role || '').toUpperCase()
    if (r === 'ADMIN') return '/admin'
    if (r === 'TEAM_LEAD' || r === 'LEAD' || r === 'TEAM LEAD') return '/lead'
    return '/employee'
  }

  const handleRequestSwitchRole = (roleKey) => {
    setUserMenuOpen(false)
    setPendingTargetRole(roleKey)
    setSwitchModalOpen(true)
  }

  const handleConfirmSwitchRole = async (password) => {
    const target = pendingTargetRole
    const result = await switchRole(target, password)
    if (result && result.success) {
      setSwitchModalOpen(false)
      setPendingTargetRole(null)
      const cleanTarget = (target || '').toLowerCase().replace('_', '').replace(' ', '')
      const dest = result.redirectPath || (
        (cleanTarget === 'teamlead' || cleanTarget === 'lead') ? '/lead/dashboard' :
        (cleanTarget === 'employee' || cleanTarget === 'emp') ? '/employee/dashboard' :
        '/admin/dashboard'
      )
      navigate(dest, { replace: true })
      return { success: true }
    }
    return result || { success: false, error: 'Password verification failed.' }
  }

  const handleLogout = () => {
    setLogoutConfirmOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 z-20 flex items-center justify-between',
          'h-[60px] px-4 sm:px-6 bg-[#FFFFFF] border-b border-[#EDE8FA] text-[#1E1B2E]',
          'transition-all duration-200 shadow-[0_2px_10px_rgba(109,74,255,0.03)]'
        )}
        style={{ left: isMobile ? 0 : (sidebarCollapsed ? 68 : 240) }}
      >
        {/* Left: Mobile hamburger + Search button */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:bg-[#F4F2FF] hover:text-[#6D4AFF] transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu size={18} />
            </button>
          )}

          {/* Header logo for mobile navigation bar */}
          <div className="flex md:hidden items-center shrink-0">
            <AccessCoreLogo size="xs" showText={false} />
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              'flex items-center justify-between w-full h-8 px-3 rounded-lg text-sm text-left',
              'bg-[#F4F2FF] border border-[#EDE8FA] text-[#64748B] hover:border-[#6D4AFF]',
              'transition-all duration-150 cursor-pointer shadow-2xs'
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <Search size={14} className="text-[#6D4AFF] shrink-0" />
              <span className="text-xs">Quick search records...</span>
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#6D4AFF] bg-[#EDE8FF] border border-[#DDD6FE] rounded">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notifications */}
          <button
            onClick={() => navigate(`${getRolePrefix()}/notifications`)}
            className={cn(
              'relative p-2 rounded-lg text-[#64748B]',
              'hover:bg-[#F4F2FF] hover:text-[#6D4AFF]',
              'transition-colors duration-150 cursor-pointer'
            )}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#6D4AFF] text-white text-[10px] font-bold shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-[#EDE8FA] mx-1" />

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-lg',
                'hover:bg-[#F4F2FF] transition-colors duration-150 cursor-pointer'
              )}
            >
              <Avatar name={user?.name || 'Tara Anand'} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#1E1B2E] leading-tight">
                  {user?.name || 'Tara Anand'}
                </p>
                <p className="text-[10px] text-[#A78BFA] font-medium leading-tight">
                  {user?.role || 'Admin'}
                </p>
              </div>
              <ChevronDown size={14} className="text-[#64748B] hidden sm:block" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                  className={cn(
                    'absolute right-0 top-full mt-1.5 w-56 py-1 z-50',
                    'bg-[#FFFFFF] border border-[#EDE8FA]',
                    'rounded-xl shadow-xl'
                  )}
                >
                  <div className="px-3 py-2 border-b border-[#EDE8FA] mb-1">
                    <p className="text-xs font-semibold text-[#1E1B2E]">{user?.name || 'Tara Anand'}</p>
                    <p className="text-[10px] text-[#64748B] truncate">{user?.email || 'tara.anand@accesscore.io'}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F2FF] text-[#6D4AFF] border border-[#DDD6FE]">
                      {user?.role || 'Admin'}
                    </span>
                  </div>

                  {/* Persona Switching for Dashboard Verification */}
                  <div className="px-3 py-1.5 border-b border-[#EDE8FA]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1">Switch Dashboard View</p>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        onClick={() => handleRequestSwitchRole('admin')}
                        className={cn(
                          'px-1.5 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors',
                          user?.role === 'Admin' ? 'bg-[#6D4AFF] text-white' : 'bg-[#F4F2FF] text-[#1E1B2E] hover:bg-[#EDE8FF]'
                        )}
                      >
                        Admin
                      </button>
                      <button
                        onClick={() => handleRequestSwitchRole('teamLead')}
                        className={cn(
                          'px-1.5 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors',
                          user?.role === 'Team Lead' ? 'bg-[#6D4AFF] text-white' : 'bg-[#F4F2FF] text-[#1E1B2E] hover:bg-[#EDE8FF]'
                        )}
                      >
                        Lead
                      </button>
                      <button
                        onClick={() => handleRequestSwitchRole('employee')}
                        className={cn(
                          'px-1.5 py-1 text-[10px] font-semibold rounded cursor-pointer transition-colors',
                          user?.role === 'Employee' ? 'bg-[#6D4AFF] text-white' : 'bg-[#F4F2FF] text-[#1E1B2E] hover:bg-[#EDE8FF]'
                        )}
                      >
                        Employee
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => { setUserMenuOpen(false); navigate(`${getRolePrefix()}/profile`) }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1E1B2E] hover:bg-[#F4F2FF] hover:text-[#6D4AFF] transition-colors cursor-pointer"
                  >
                    My Profile & Settings
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate(`${getRolePrefix() === '/employee' ? '/employee/requests' : getRolePrefix() + '/team'}`) }}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#1E1B2E] hover:bg-[#F4F2FF] hover:text-[#6D4AFF] transition-colors cursor-pointer"
                  >
                    {user?.role === 'Employee' ? 'My Requests' : 'Team Directory'}
                  </button>
                  <div className="my-1 border-t border-[#EDE8FA]" />
                  <button
                    onClick={() => { setUserMenuOpen(false); setLogoutConfirmOpen(true) }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Password Verification Modal for Role Switching */}
      <PasswordVerificationModal
        open={switchModalOpen}
        targetRole={pendingTargetRole}
        onClose={() => {
          setSwitchModalOpen(false)
          setPendingTargetRole(null)
        }}
        onConfirm={handleConfirmSwitchRole}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Logout Confirmation Dialog */}
      <Modal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        title="Sign Out of ACCESSCORE"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#64748B]">
            Are you sure you want to sign out? Your unsaved working drafts are saved to browser local storage.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLogoutConfirmOpen(false)}
            >
              Stay Logged In
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleLogout}
              iconLeft={<LogOut size={14} />}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
