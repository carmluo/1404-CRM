// Figma nodes 1091:65678 (active) + 1304:87923 (history)
// Active:  shows overdue/no-activity tags, right stats gap-[16px]
// History: shows Won/Lost pill (top-right absolute), right stats gap-[41px], no overdue tag
// Container: bg-surface-white border border-border rounded-badge px-[16px] py-[8px] relative
// Left: flex-col gap-[4px] — title + bids | owner | close date + overdue tag
// Right: Stage + Amount stat stacks (label body-3 subtlest, value bold body-2)
// Won pill:  bg-safe   rounded-[100px] h-[25px] pl-[10px] pr-[12px] py-[4px] text-safe-text
// Lost pill: bg-danger rounded-[100px] h-[25px] pl-[10px] pr-[12px] py-[4px] text-danger-text
import { format, parseISO, differenceInDays } from 'date-fns'
import { Users, AlertTriangle } from 'lucide-react'

function formatAmount(val) {
  if (!val && val !== 0) return '$0'
  return `$${val.toLocaleString()}`
}

const STATUS_PILL = {
  won:  { bg: 'bg-safe',   text: 'text-safe-text',   label: 'Won' },
  lost: { bg: 'bg-danger', text: 'text-danger-text',  label: 'Lost' },
}

export default function OpportunityCard({ opportunity: opp, onClick }) {
  const bidCount = opp.bids?.length ?? 0

  const isHistory = opp.status === 'won' || opp.status === 'lost'
  const pill = STATUS_PILL[opp.status]

  const isOverdue = !isHistory && opp.status === 'overdue'
  const overdueBy = opp.overdueBy
    ?? (opp.closeDate ? Math.max(0, differenceInDays(new Date(), parseISO(opp.closeDate))) : 0)

  const isNoActivity = !isHistory && opp.status === 'no-activity'

  return (
    <div
      onClick={onClick}
      className="relative bg-surface-white border border-border rounded-badge px-[16px] py-[8px] flex items-end justify-between gap-[16px] w-full cursor-pointer hover:bg-surface-hover transition-colors"
    >
      {/* ── Won / Lost pill ── */}
      {pill && (
        <div className={`absolute top-[10px] right-[16px] flex items-center h-[25px] pl-[10px] pr-[12px] py-[4px] rounded-[100px] ${pill.bg}`}>
          <span className={`font-crm text-body-3 font-bold whitespace-nowrap ${pill.text}`}>
            {pill.label}
          </span>
        </div>
      )}

      {/* ── Left: main info ── */}
      <div className="flex flex-col gap-[4px] min-w-0">

        {/* Title + bid count */}
        <div className="flex items-center gap-[16px]">
          <p className="font-crm text-body-2 font-bold text-content whitespace-nowrap truncate">
            {opp.title}
          </p>
          {bidCount > 0 && (
            <div className="flex items-center gap-[4px] shrink-0">
              <Users size={14} className="text-content-subtlest" />
              <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">
                {bidCount} bid{bidCount !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Owner / contact name */}
        <p className="font-crm text-body-2 text-content whitespace-nowrap">
          {opp.contact ?? opp.accountOwner ?? '—'}
        </p>

        {/* Close date + status tags */}
        <div className="flex items-center gap-[8px]">
          {opp.closeDate && (
            <p className="font-crm text-body-2 text-content whitespace-nowrap">
              Close date: <span className="font-bold">{format(parseISO(opp.closeDate), 'MMM d, yyyy')}</span>
            </p>
          )}
          {isOverdue && (
            <div className="flex items-center gap-[6px] bg-warning rounded-badge px-[8px] py-[4px] shrink-0">
              <AlertTriangle size={16} className="text-warning-bold shrink-0" />
              <span className="font-crm text-body-3 text-warning-bold whitespace-nowrap">
                Overdue by {overdueBy} day{overdueBy !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {isNoActivity && (
            <span className="font-crm text-body-3 text-content-disabled whitespace-nowrap">
              No activity for {opp.noActivityMonths} month{opp.noActivityMonths > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── Right: stat stacks ── */}
      <div className="flex items-end shrink-0 gap-[16px]">
        {!isHistory && (
          <div className="flex flex-col items-end">
            <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Stage</span>
            <span className="font-crm text-body-2 font-bold text-content whitespace-nowrap">{opp.stage}</span>
          </div>
        )}
        <div className="flex flex-col items-end">
          <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Amount</span>
          <span className="font-crm text-body-2 font-bold text-content whitespace-nowrap">{formatAmount(opp.amount)}</span>
        </div>
      </div>
    </div>
  )
}
