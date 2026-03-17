import { useState } from 'react'
import { ChevronDown, FileText, Activity } from 'lucide-react'
import { format, parseISO } from 'date-fns'

// Figma node 1279:84327
// Year-grouped activity timeline for bidding history
// Year header: bg-surface border-border rounded-[8px] px-[6px] py-[2px], chevron toggle
// Activity item: 20px icon (bg-brand rounded-badge p-[4px]) + body-3 text + 12px date
// Connector: vertical line at left=10px (icon center) between items
// Gap: 24px between year groups, 16px header→items, 4px between items

const ICON_MAP = {
  bid:    FileText,
  status: Activity,
}

// Split "Submitted bid: $110,000" → { label: "Submitted bid: ", value: "$110,000" }
function parseDescription(description) {
  const arrowIdx = description.lastIndexOf(' → ')
  if (arrowIdx !== -1) {
    return { label: description.slice(0, arrowIdx + 3), value: description.slice(arrowIdx + 3) }
  }
  const colonIdx = description.lastIndexOf(': ')
  if (colonIdx !== -1) {
    return { label: description.slice(0, colonIdx + 2), value: description.slice(colonIdx + 2) }
  }
  return { label: description, value: null }
}

function ActivityItem({ event }) {
  const Icon = ICON_MAP[event.type] ?? FileText
  const { label, value } = parseDescription(event.description)

  return (
    <div className="flex items-center gap-[12px]">
      {/* Icon */}
      <div className="relative z-10 shrink-0 w-5 h-5 bg-brand rounded-badge p-[4px] flex items-center justify-center">
        <Icon size={10} className="text-content-primary" strokeWidth={2} />
      </div>

      {/* Description */}
      <p className="font-crm text-body-3 text-content whitespace-nowrap min-w-0">
        {label}
        {value && <span className="font-bold">{value}</span>}
      </p>

      {/* Date */}
      <span className="font-crm text-[12px] leading-normal text-content-disabled whitespace-nowrap ml-auto shrink-0">
        {format(parseISO(event.date), 'MMM d')}
      </span>
    </div>
  )
}

function YearGroup({ year, events }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Year header row */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="flex items-center gap-[8px] w-full"
      >
        <span className="bg-surface border border-border rounded-[8px] px-[6px] py-[2px] font-crm text-body-3 text-content-subtlest whitespace-nowrap">
          {year}
        </span>
        <div className="flex-1 h-px bg-border" />
        <ChevronDown
          size={20}
          className={`text-content-subtlest shrink-0 transition-transform duration-[180ms] ease-out ${collapsed ? '-rotate-90' : ''}`}
        />
      </button>

      {/* Activity list with connector line */}
      {!collapsed && (
        <div className="relative">
          {events.length > 1 && (
            <div className="absolute left-[10px] top-5 bottom-[10px] w-px bg-border" />
          )}
          <div className="flex flex-col gap-[4px]">
            {events.map((event, i) => (
              <ActivityItem key={i} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function BiddingHistory({ years = [] }) {
  if (!years.length) {
    return <p className="font-crm text-body-3 text-content-disabled">No history available.</p>
  }

  const sorted = [...years].sort((a, b) => b.year - a.year)

  return (
    <div className="flex flex-col gap-[24px]">
      {sorted.map(group => {
        const sortedEvents = [...(group.events ?? [])].sort((a, b) => b.date.localeCompare(a.date))
        return <YearGroup key={group.year} year={group.year} events={sortedEvents} />
      })}
    </div>
  )
}
