import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Breadcrumbs from './Breadcrumbs'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useIsMobile } from '../../hooks/useIsMobile'
import { cn } from '../../utils/helpers'

export default function AppLayout() {
  const [collapsed] = useLocalStorage('ac-sidebar-collapsed', false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const isMobile = useIsMobile(768)
  const location = useLocation()

  // Auto-close mobile drawer on route change
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname)
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false)
    }
  }

  // Prevent background scrolling when mobile navigation drawer is active
  useEffect(() => {
    if (isMobile && mobileSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, mobileSidebarOpen])

  return (
    <div className="min-h-screen bg-[#F4F2FF] text-[#1E1B2E] transition-colors duration-150">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#6D4AFF] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <Topbar
        onToggleMobileSidebar={() => setMobileSidebarOpen(o => !o)}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn( 'pt-[60px] min-h-screen transition-all duration-200 outline-none' )}
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? 68 : 240)
        }}
      >
        <div className="p-3 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
