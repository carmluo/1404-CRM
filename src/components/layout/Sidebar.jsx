import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { House, Briefcase, TrendingUp, MonitorCheck, FolderKanban } from 'lucide-react'
import { NAV_HEIGHT, SIDEBAR_COLLAPSED, SIDEBAR_EXPANDED } from './Layout'

// Figma node 519:74381
// Icon pill:  52×52px, rounded-[100px], px-[16px] py-[12px], icon 24px
// Label pill: rounded-[12px], px-[16px] py-[12px], font-crm 18px/27px
// States:
//   Default → icon bg rgba(255,255,255,0.7), label bg rgba(255,255,255,0.7), text #414141
//   Hover   → icon bg rgba(255,255,255,0.7), label bg #E5E5E5, text #414141
//   Active  → icon bg #2D2D2D, label bg #2D2D2D, text #F2F2F2

const navItems = [
  { icon: House,        label: 'Home' },
  { icon: Briefcase,    label: 'Templates' },
  { icon: TrendingUp,   label: 'Labor Forecast' },
  { icon: MonitorCheck, label: 'Daily Task Reporting' },
  { icon: FolderKanban, label: 'Shop Manager Hub' },
  { icon: Briefcase,    label: 'CRM', isCRM: true },
]

function SidebarTab({ item, expanded, active }) {
  const [hovered, setHovered] = useState(false)
  const Icon = item.icon

  const iconBg   = active ? '#2D2D2D' : 'rgba(255,255,255,0.7)'
  const labelBg  = active ? '#2D2D2D' : hovered ? '#E5E5E5' : 'rgba(255,255,255,0.7)'
  const textColor = active ? '#F2F2F2' : '#414141'
  const iconColor = active ? '#F2F2F2' : '#414141'

  return (
    <div
      className="flex items-center overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'none', border: 'none' }}
    >
      {/* Icon pill */}
      <div
        className="flex items-center justify-center shrink-0 transition-colors duration-150"
        style={{
          width: 52,
          height: 52,
          borderRadius: 100,
          backgroundColor: iconBg,
        }}
      >
        <Icon size={24} color={iconColor} strokeWidth={1.75} />
      </div>

      {/* Label pill — slides in via maxWidth clip */}
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{ maxWidth: expanded ? 240 : 0 }}
      >
        <div
          className="whitespace-nowrap font-crm transition-colors duration-150"
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 12,
            paddingBottom: 12,
            borderRadius: 12,
            backgroundColor: labelBg,
            color: textColor,
            fontSize: 18,
            lineHeight: '27px',
            fontWeight: 400,
          }}
        >
          {item.label}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ expanded, onExpand, onCollapse }) {
  const navigate = useNavigate()

  return (
    <motion.aside
      animate={{ width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="sticky shrink-0 flex flex-col overflow-hidden"
      style={{
        top: NAV_HEIGHT,
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        backgroundColor: '#F2F2F2',
      }}
      onMouseEnter={onExpand}
      onMouseLeave={onCollapse}
    >
      <div
        className="flex flex-col"
        style={{ paddingTop: 80, paddingBottom: 80, paddingLeft: 24, gap: 16 }}
      >
        {navItems.map(item => (
          <button
            key={item.label}
            onClick={() => { if (item.isCRM) navigate('/') }}
            className="flex items-center overflow-hidden"
            title={!expanded ? item.label : undefined}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <SidebarTab
              item={item}
              expanded={expanded}
              active={!!item.isCRM}
            />
          </button>
        ))}
      </div>
    </motion.aside>
  )
}
