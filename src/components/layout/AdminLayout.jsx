import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import RoleSidebar from './RoleSidebar'
import Topbar from './Topbar'
import Breadcrumbs from './Breadcrumbs'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useIsMobile } from '../../hooks/useIsMobile'
import { cn } from '../../utils/helpers'

export default function AdminLayout() {
  const [collapsed] = useLocalStorage('ac-sidebar-collapsed', false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const isMobile = useIsMobile(768)

  return (
    <div className="min-h-screen bg-[#F4F2FF] text-[#1E1B2E] transition-colors duration-150">
      <RoleSidebar
        role="admin"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <Topbar
        onToggleMobileSidebar={() => setMobileSidebarOpen(o => !o)}
      />
      <main
        className={cn('pt-[60px] min-h-screen transition-all duration-200')}
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? 68 : 240)
        }}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Breadcrumbs />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
