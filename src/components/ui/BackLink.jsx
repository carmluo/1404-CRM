import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

// Figma node 1026:8691
// Default: text #565656, Hover: text #232323
// Icon 24px, gap 4px, font Body 2 (18px/27px) weight 400

export default function BackLink({ label, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center"
      style={{
        gap: 4,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: hovered ? '#232323' : '#565656',
        transition: 'color 0.15s ease',
      }}
    >
      <ChevronLeft size={24} strokeWidth={1.75} />
      <span
        className="font-crm whitespace-nowrap"
        style={{ fontSize: 18, lineHeight: '27px', fontWeight: 400 }}
      >
        {label}
      </span>
    </button>
  )
}
