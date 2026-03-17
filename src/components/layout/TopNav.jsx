import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutGrid, Layers, Building2, User, Bell } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { NAV_HEIGHT } from './Layout'
import NavLink from '../ui/NavLink'

const tabs = [
  { label: 'Dashboard', path: '/', icon: LayoutGrid, exact: true },
  { label: 'Opportunities', path: '/opportunities', icon: Layers },
  { label: 'Accounts', path: '/accounts', icon: Building2 },
  { label: 'Contacts', path: '/contacts', icon: User },
]

export default function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { savedForLaterTasks, setIsNotificationDrawerOpen, isNotificationDrawerOpen } = useApp()

  function isActive(tab) {
    if (tab.exact) return location.pathname === tab.path
    return location.pathname.startsWith(tab.path)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center"
      style={{
        backgroundColor: '#F2F2F2',
        padding: 24,
        gap: 32,
      }}
    >
      {/* CRM logo — teal pill matching Figma */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          backgroundColor: '#cfe8e0',
          border: '1.182px solid #92c9b9',
          borderRadius: 9.455,
          padding: 11.818,
        }}
      >
        <Building2 size={28} color="#2B6B52" strokeWidth={1.75} />
      </div>

      {/* Nav links */}
      <nav className="flex items-center" style={{ gap: 12 }}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            icon={tab.icon}
            label={tab.label}
            active={isActive(tab)}
            onClick={() => navigate(tab.path)}
          />
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notification bell */}
      <button
        onClick={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
        className="relative flex items-center justify-center transition-colors duration-150"
        style={{
          width: 44,
          height: 44,
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.7)',
          border: 'none',
          cursor: 'pointer',
          color: '#414141',
        }}
      >
        <Bell size={20} strokeWidth={1.75} />
        {savedForLaterTasks.length > 0 && (
          <span
            className="absolute flex items-center justify-center text-white font-bold"
            style={{
              top: 2,
              right: 2,
              width: 16,
              height: 16,
              borderRadius: 100,
              backgroundColor: '#2B6B52',
              fontSize: 10,
              lineHeight: 1,
            }}
          >
            {savedForLaterTasks.length}
          </span>
        )}
      </button>
    </header>
  )
}
