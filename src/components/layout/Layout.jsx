import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import NotificationDrawer from '../ui/NotificationDrawer'
import { AppProvider } from '../../context/AppContext'

export const NAV_HEIGHT = 100
export const SIDEBAR_COLLAPSED = 76
export const SIDEBAR_EXPANDED = 296

export default function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F2F2F2' }}>
        {/* Full-width top nav */}
        <TopNav />

        {/* Below-nav body: sidebar + main in a flex row */}
        <div className="flex flex-1" style={{ paddingTop: NAV_HEIGHT }}>
          <Sidebar
            expanded={sidebarExpanded}
            onExpand={() => setSidebarExpanded(true)}
            onCollapse={() => setSidebarExpanded(false)}
          />

          {/* Main content — flex-1 so it fills remaining width, naturally pushed by sidebar */}
          <main className="flex-1 min-h-[calc(100vh-100px)] overflow-auto">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>

        <NotificationDrawer />
      </div>
    </AppProvider>
  )
}
