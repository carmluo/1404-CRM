// Figma node 1026:8501
// Row layout: flex px-[16px] py-[8px] border-b border-border gap-[8px] items-center
// Header labels: font-crm text-body-3 text-content uppercase tracking-wide
// Estimate name: flex-[1_0_0] min-w-[180px] font-crm text-body-2 text-content-subtle underline
// Amount:        flex-[1_0_0] max-w-[180px] font-crm text-body-2 text-content-subtle
// Date:          w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap
// Status badge:  w-[90px] shrink-0 rounded-[100px] pl-[10px] pr-[12px] py-[4px]
// Footer:        px-[16px] py-[4px] font-crm text-body-3 text-content-disabled
import { format, parseISO } from 'date-fns'
import { Mail } from 'lucide-react'
import Badge from './Badge'

function formatCurrency(val) {
  if (!val && val !== 0) return '—'
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  return `$${val}`
}

export default function EstimatesTable({
  estimates = [],
  onSend,
  onFollowUp,
  showOppTitle = false,
}) {
  const hasActions = !!(onSend || onFollowUp)

  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border">
        <p className="flex-[1_0_0] min-w-[180px] font-crm text-body-3 text-content uppercase tracking-wide">Estimate</p>
        <p className="flex-[1_0_0] max-w-[180px] min-w-0 font-crm text-body-3 text-content uppercase tracking-wide">Amount</p>
        <p className="w-[110px] shrink-0 font-crm text-body-3 text-content uppercase tracking-wide">Date</p>
        <p className="w-[90px] shrink-0 font-crm text-body-3 text-content uppercase tracking-wide">Status</p>
        {hasActions && (
          <p className="w-[90px] shrink-0 font-crm text-body-3 text-content uppercase tracking-wide text-right">Action</p>
        )}
      </div>

      {/* Empty state */}
      {estimates.length === 0 ? (
        <p className="px-[16px] py-[12px] font-crm text-body-3 text-content-disabled">No estimates yet.</p>
      ) : (
        <>
          {estimates.map((est, i) => {
            const statusKey = est.status?.toLowerCase()
            return (
              <div key={est.id || i} className="flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border last:border-0">
                {/* Estimate name (+ opp title sub-line if multi-opp context) */}
                <div className="flex-[1_0_0] min-w-[180px] min-w-0">
                  <a
                    href="#"
                    className="font-crm text-body-2 text-content-subtle underline [text-decoration-skip-ink:none] truncate block"
                  >
                    {est.name}
                  </a>
                  {showOppTitle && est.oppTitle && (
                    <p className="font-crm text-body-3 text-content-disabled truncate mt-0.5">{est.oppTitle}</p>
                  )}
                </div>

                {/* Amount */}
                <p className="flex-[1_0_0] max-w-[180px] min-w-0 font-crm text-body-2 text-content-subtle">
                  {formatCurrency(est.amount)}
                </p>

                {/* Date */}
                <p className="w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap">
                  {format(parseISO(est.date), 'MMM d, yyyy')}
                </p>

                {/* Status badge */}
                <div className="w-[90px] shrink-0">
                  <Badge variant="status" value={statusKey} label={est.status} />
                </div>

                {/* Action */}
                {hasActions && (
                  <div className="w-[90px] shrink-0 flex justify-end">
                    {statusKey === 'drafted' && onSend && (
                      <button
                        onClick={() => onSend(est)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-card bg-brand-action font-crm text-body-3 font-bold text-content-invert hover:opacity-90 transition-opacity"
                      >
                        <Mail size={12} />
                        Send
                      </button>
                    )}
                    {(statusKey === 'sent' || statusKey === 'pending') && onFollowUp && (
                      <button
                        onClick={() => onFollowUp(est)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-card border border-border font-crm text-body-3 text-content-subtlest hover:bg-surface transition-colors"
                      >
                        <Mail size={12} />
                        Follow up
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Footer — pagination */}
          <div className="px-[16px] py-[4px]">
            <p className="font-crm text-body-3 text-content-disabled">
              1–{estimates.length} of {estimates.length}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
