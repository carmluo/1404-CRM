import { useState } from 'react'
import { Mail, Bell, ArrowUpRight, Phone } from 'lucide-react'

// Figma node 407:38540
// Icon-only:  33.33×33.33px, p-[10px], rounded-[8px], 1px border
// With-label: px-[16px] py-[10px], gap-[10px] — only mail (w-[123.333px]) and call (auto)
// Labels: mail→"Send email", call→"Call mobile" (Body/B3 14px/21px #565656)
// Hover state: only defined for call icon-only (bg #e9dcce)

const TYPE_CONFIG = {
  mail: {
    Icon: Mail,
    iconSize: 16,
    bg: '#e4e9e8',
    bgHover: '#e4e9e8',
    border: '#92c9b9',
    iconColor: '#2B6B52',
    label: 'Send email',
    labeledWidth: 123.333,
  },
  notification: {
    Icon: Bell,
    iconSize: 16,
    bg: 'rgba(255,255,255,0.7)',
    bgHover: 'rgba(255,255,255,0.7)',
    border: '#e5e5e5',
    iconColor: '#414141',
  },
  link: {
    Icon: ArrowUpRight,
    iconSize: 14,
    bg: '#ece0f3',
    bgHover: '#ece0f3',
    border: '#d6aded',
    iconColor: '#7B3FA0',
  },
  call: {
    Icon: Phone,
    iconSize: 16,
    bg: '#eae7e4',
    bgHover: '#e9dcce',
    border: '#dac5ae',
    iconColor: '#8B6B5A',
    label: 'Call mobile',
  },
}

// Only mail and call support hasLabel
const LABELED_TYPES = ['mail', 'call']

export default function IconActivityType({ type = 'mail', hasLabel = false, onClick }) {
  const [hovered, setHovered] = useState(false)
  const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.mail
  const Icon = config.Icon
  const showLabel = hasLabel && LABELED_TYPES.includes(type)
  const bg = hovered ? config.bgHover : config.bg

  if (showLabel) {
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center transition-colors duration-150 shrink-0"
        style={{
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 10,
          paddingBottom: 10,
          gap: 10,
          height: 33.33,
          width: config.labeledWidth ?? 'auto',
          borderRadius: 8,
          border: `1px solid ${config.border}`,
          backgroundColor: bg,
          cursor: 'pointer',
        }}
      >
        <Icon size={config.iconSize} color={config.iconColor} strokeWidth={1.75} />
        <span
          className="font-crm whitespace-nowrap"
          style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}
        >
          {config.label}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center transition-colors duration-150 shrink-0"
      style={{
        width: 33.33,
        height: 33.33,
        padding: 10,
        borderRadius: 8,
        border: `1px solid ${config.border}`,
        backgroundColor: bg,
        cursor: 'pointer',
      }}
    >
      <Icon size={config.iconSize} color={config.iconColor} strokeWidth={1.75} />
    </button>
  )
}
