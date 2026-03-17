/**
 * ContactsContainer — Figma node 1296:86293
 *
 * Two variants rendered in sequence (no outer card — wrap in caller):
 *
 * Default (existing contacts):
 *   Columns: NAME (115px) | LOCATION (115px) | LAST CONTACTED (85px) | ACTION
 *   Row:     border-b border-[#e5e5e5] px-[16px] py-[8px] flex items-center justify-between
 *   Name:    bold 14px/21px #414141 | title italic 14px/21px #565656
 *   Action:  IconActivityType mail + call, gap-[4px]
 *
 * AI (suggested contacts):
 *   Columns: NAME (115px) | LOCATION (115px) | REASON (badge) | ACTION (accept/deny)
 *   Reason:  bg-brand-secondary border border-border-secondary px-[8px] py-[2px]
 *            rounded-badge text-body-3 text-content-secondary-bold
 *   Buttons: bg-surface-white border border-border p-[8px] rounded-[8px] 33.33px square
 *
 * Header labels: Label/L3 — 12px medium uppercase text-content-disabled
 */
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { Check, X } from 'lucide-react'
import IconActivityType from './IconActivityType'

function ColHeader({ children, width }) {
  return (
    <div className="flex flex-col items-start shrink-0" style={width ? { width } : {}}>
      <p className="font-crm text-[12px] font-medium leading-none uppercase text-content-disabled">
        {children}
      </p>
    </div>
  )
}

function formatLastContacted(dateStr) {
  if (!dateStr) return '—'
  try {
    const d = parseISO(dateStr)
    const daysAgo = Math.floor((Date.now() - d.getTime()) / 86400000)
    if (daysAgo === 0) return 'Today'
    if (daysAgo < 14) return `${daysAgo} days ago`
    return format(d, 'MMM d, yyyy')
  } catch {
    return '—'
  }
}

export default function ContactsContainer({
  contacts = [],
  suggestedContacts = [],
  dismissedSuggested = [],
  acceptedSuggested = [],
  onContactClick,
  onEmail,
  onPhone,
  onAcceptSuggested,
  onDismissSuggested,
}) {
  const visibleSuggested = suggestedContacts.filter(
    s => !dismissedSuggested.includes(s.name) && !acceptedSuggested.includes(s.name)
  )

  return (
    <div className="flex flex-col w-full">

      {/* ── Default contacts ─────────────────────────────── */}
      {contacts.length > 0 && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-[16px] py-[8px] border-b border-[#e5e5e5]">
            <ColHeader width={115}>Name</ColHeader>
            <ColHeader width={115}>Location</ColHeader>
            <ColHeader width={85}>Last contacted</ColHeader>
            <ColHeader>Action</ColHeader>
          </div>

          {/* Rows */}
          {contacts.map(cnt => (
            <div
              key={cnt.id}
              className="flex items-center justify-between px-[16px] py-[8px] border-b border-[#e5e5e5]"
            >
              {/* Name + title */}
              <div
                className="flex flex-col items-start leading-[21px] shrink-0 cursor-pointer"
                style={{ minWidth: 115 }}
                onClick={() => onContactClick?.(cnt)}
              >
                <p className="font-crm text-body-3 font-bold text-content-subtle hover:underline whitespace-nowrap">
                  {cnt.name}
                </p>
                <p className="font-crm text-body-3 italic text-content-subtlest whitespace-nowrap">
                  {cnt.title}
                </p>
              </div>

              {/* Location */}
              <div className="shrink-0" style={{ width: 115 }}>
                <p className="font-crm text-body-3 text-content-subtlest leading-[21px]">
                  {cnt.location || '—'}
                </p>
              </div>

              {/* Last contacted */}
              <div className="shrink-0" style={{ width: 85 }}>
                <p className="font-crm text-body-3 text-content-subtlest leading-[21px]">
                  {formatLastContacted(cnt.lastContacted)}
                </p>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-[4px] shrink-0">
                <IconActivityType
                  type="mail"
                  onClick={() => onEmail?.(cnt)}
                />
                <IconActivityType
                  type="call"
                  onClick={() => onPhone?.(cnt)}
                />
              </div>
            </div>
          ))}
        </>
      )}

      {/* ── AI suggested contacts ─────────────────────────── */}
      {visibleSuggested.length > 0 && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-[16px] py-[8px] border-b border-[#e5e5e5]">
            <ColHeader width={115}>Name</ColHeader>
            <ColHeader width={115}>Location</ColHeader>
            <ColHeader width={82}>Reason</ColHeader>
            <ColHeader>Action</ColHeader>
          </div>

          {/* Rows */}
          {visibleSuggested.map(sug => (
            <div
              key={sug.name}
              className="flex items-center justify-between px-[16px] py-[8px] border-b border-[#e5e5e5]"
            >
              {/* Name + title */}
              <div className="flex flex-col items-start leading-[21px] shrink-0" style={{ minWidth: 115 }}>
                <p className="font-crm text-body-3 font-bold text-content-subtle whitespace-nowrap">
                  {sug.name}
                </p>
                <p
                  className="font-crm text-body-3 italic text-content-subtlest overflow-hidden text-ellipsis"
                  style={{ maxWidth: 115 }}
                >
                  {sug.title}
                </p>
              </div>

              {/* Location */}
              <div className="shrink-0" style={{ width: 115 }}>
                <p className="font-crm text-body-3 text-content-subtlest leading-[21px]">
                  {sug.location || '—'}
                </p>
              </div>

              {/* Reason badge */}
              <div className="flex items-center justify-center shrink-0" style={{ width: 82 }}>
                <span className="bg-brand-secondary border border-border-secondary px-[8px] py-[2px] rounded-badge font-crm text-body-3 text-content-secondary-bold whitespace-nowrap">
                  {sug.reason}
                </span>
              </div>

              {/* Accept / deny */}
              <div className="flex items-center gap-[4px] shrink-0">
                <button
                  onClick={() => onAcceptSuggested?.(sug.name)}
                  className="flex items-center justify-center bg-surface-white border border-border p-[8px] rounded-[8px] transition-colors hover:bg-surface"
                  style={{ width: 33.33, height: 33.33 }}
                >
                  <Check size={16} strokeWidth={1.75} className="text-content-subtle" />
                </button>
                <button
                  onClick={() => onDismissSuggested?.(sug.name)}
                  className="flex items-center justify-center bg-surface-white border border-border p-[8px] rounded-[8px] transition-colors hover:bg-surface"
                  style={{ width: 33.33, height: 33.33 }}
                >
                  <X size={16} strokeWidth={1.75} className="text-content-subtle" />
                </button>
              </div>
            </div>
          ))}
        </>
      )}

    </div>
  )
}
