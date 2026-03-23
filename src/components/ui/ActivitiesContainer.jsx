import { useState } from 'react'
import { ChevronDown, Search, Phone, Mail, FileText, LayoutGrid, Sparkles } from 'lucide-react'
import { format, parseISO, differenceInDays, isThisWeek } from 'date-fns'

// Figma node 1279:85437
// Outer: flex flex-col gap-[4px] px-[16px] w-full
// Search: bg-surface-white border border-border rounded-full pl-[16px] pr-[8px] py-[6px] gap-[8px]
// Activity blocks: flex flex-col gap-[24px] pb-[32px]
// Period header: bg-surface rounded-card px-[6px] py-[2px] (+ border border-border if not "This week")
// Activity item: flex gap-[12px] items-center
// Activity icon: size-[20px] bg-brand rounded-[4px] p-[4px]
// Description: font-crm text-body-3 text-content
// Date: text-[12px] font-crm font-medium text-content-disabled
// Nested: icon placeholder + dash (w-[7px] h-px bg-border) + text-content-subtlest
// Connector lines: absolute left-[10px] top-[22px] bottom-[-4px] w-px bg-border

const TYPE_ICON = {
  call: Phone,
  bid: LayoutGrid,
  estimate: FileText,
  email: Mail,
  created: Sparkles,
}

function formatActivityDate(dateStr) {
  if (!dateStr) return ''
  const date = parseISO(dateStr)
  const today = new Date()
  const days = differenceInDays(today, date)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const sameYear = today.getFullYear() === date.getFullYear()
  return sameYear ? format(date, 'MMM d') : format(date, 'MMM d, yyyy')
}

function getPeriodLabel(dateStr) {
  const date = parseISO(dateStr)
  const today = new Date()
  if (isThisWeek(date, { weekStartsOn: 1 })) return 'This week'
  const sameYear = today.getFullYear() === date.getFullYear()
  return sameYear ? format(date, 'MMM') : format(date, 'MMM yyyy')
}

function groupActivities(activities) {
  const sorted = [...activities].sort((a, b) => b.date.localeCompare(a.date))
  const groups = []
  const map = new Map()
  for (const a of sorted) {
    const label = getPeriodLabel(a.date)
    if (!map.has(label)) {
      const g = { label, items: [] }
      map.set(label, g)
      groups.push(g)
    }
    map.get(label).items.push(a)
  }
  return groups
}

function ActivityIcon({ type }) {
  const Icon = TYPE_ICON[type] ?? FileText
  return (
    <div className="size-[20px] bg-brand rounded-[4px] p-[4px] shrink-0 flex items-center justify-center overflow-hidden">
      <Icon size={10} className="text-content-primary" strokeWidth={2} />
    </div>
  )
}

// Horizontal branch used in icon-column placeholders for sub-rows.
// Connects the vertical spine line (at x=10) rightward toward the row content.
function BranchConnector() {
  return (
    <div className="relative size-[20px] shrink-0">
      <div className="absolute left-[10px] right-0 top-1/2 h-px bg-border" />
    </div>
  )
}

function ActivityEntry({ activity, isLast }) {
  const [expanded, setExpanded] = useState(true)
  const hasChanges = activity.changes?.length > 0

  // Spine line runs from just below the main icon (top-[22px]) downward.
  // - When not last: extends past the bottom edge by 4px to bridge the gap to the next item.
  // - When last but expanded: extends to the bottom of the accordion rows.
  // Both cases share the same left-[10px] position (center of the 20px icon column).
  const showSpine = !isLast || (hasChanges && expanded)

  return (
    <div className="relative flex flex-col gap-[4px]">
      {showSpine && (
        <div
          className={`absolute left-[10px] top-[22px] w-px bg-border pointer-events-none ${
            !isLast ? 'bottom-[-4px]' : 'bottom-0'
          }`}
        />
      )}

      {/* Main row */}
      <div className="flex gap-[12px] items-center">
        <ActivityIcon type={activity.type} />
        <p className="font-crm text-body-3 text-content flex-1 min-w-0">
          {activity.bold ? (
            <>
              {activity.description.slice(0, activity.description.indexOf(activity.bold))}
              <span className="font-bold">{activity.bold}</span>
              {activity.description.slice(activity.description.indexOf(activity.bold) + activity.bold.length)}
            </>
          ) : activity.description}
        </p>
        <p className="text-[12px] font-crm font-medium text-content-disabled whitespace-nowrap shrink-0">
          {formatActivityDate(activity.date)}
        </p>
      </div>

      {/* Show/Hide changes toggle — L-elbow branch from spine */}
      {hasChanges && (
        <div className="flex gap-[12px] items-center">
          <BranchConnector />
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex gap-[8px] items-center"
          >
            <ChevronDown
              size={12}
              className={`text-content-disabled transition-transform duration-[180ms] ease-out ${expanded ? 'rotate-180' : ''}`}
              strokeWidth={2}
            />
            <span className="font-crm text-body-3 text-content-disabled whitespace-nowrap">
              {expanded ? 'Hide all changes' : 'Show all changes'}
            </span>
          </button>
        </div>
      )}

      {/* Nested changes — each gets its own branch from the spine */}
      {hasChanges && expanded && (
        <>
          {activity.changes.map((change, i) => (
            <div key={i} className="flex gap-[12px] items-center">
              <BranchConnector />
              <div className="flex gap-[8px] items-center">
                <div className="w-[7px] h-px bg-border shrink-0" />
                <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">
                  {change.linkText ? (
                    <>
                      {change.text.split(change.linkText)[0]}
                      <span className="underline [text-decoration-skip-ink:none]">
                        {change.linkText}
                      </span>
                      {change.text.split(change.linkText)[1] ?? ''}
                    </>
                  ) : (
                    change.text
                  )}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

function PeriodBlock({ label, items }) {
  const [collapsed, setCollapsed] = useState(false)
  const withBorder = label !== 'This week'

  return (
    <div className="flex flex-col gap-[16px] w-full">
      {/* Period header */}
      <div className="flex gap-[8px] items-center w-full">
        <div className={`bg-surface rounded-card px-[6px] py-[2px] shrink-0 ${withBorder ? 'border border-border' : ''}`}>
          <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">{label}</span>
        </div>
        <div className="flex-1 h-px bg-border" />
        <button onClick={() => setCollapsed(c => !c)} className="shrink-0">
          <ChevronDown
            size={20}
            className={`text-content-subtlest transition-transform duration-[180ms] ease-out ${collapsed ? '-rotate-90' : ''}`}
            strokeWidth={1.75}
          />
        </button>
      </div>

      {/* Activity items with connector lines */}
      {!collapsed && (
        <div className="flex flex-col gap-[4px]">
          {items.map((activity, i) => (
            <ActivityEntry
              key={activity.id ?? i}
              activity={activity}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ActivitiesContainer({ activities = [], search = '', onSearchChange }) {
  const filtered = activities.filter(a =>
    !search || a.description.toLowerCase().includes(search.toLowerCase())
  )
  const groups = groupActivities(filtered)

  return (
    <div className="flex flex-col gap-[4px] px-[16px] w-full">
      {/* Search input */}
      <div className="flex items-center gap-[8px] bg-surface-white border border-border rounded-full pl-[16px] pr-[8px] py-[6px] mb-[4px] w-[45%] self-end">
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange?.(e.target.value)}
          placeholder='Search activities ... "submitted estimate"'
          className="flex-1 min-w-0 font-crm text-body-3 text-content placeholder:text-content-disabled bg-transparent focus:outline-none"
        />
        <Search size={20} className="text-content-disabled shrink-0" strokeWidth={1.5} />
      </div>

      {/* Activity groups */}
      <div className="flex flex-col gap-[24px] pb-[32px]">
        {groups.length === 0 ? (
          <p className="font-crm text-body-3 text-content-disabled px-[8px] py-[4px]">
            No activity found.
          </p>
        ) : (
          groups.map(group => (
            <PeriodBlock key={group.label} label={group.label} items={group.items} />
          ))
        )}
      </div>
    </div>
  )
}
