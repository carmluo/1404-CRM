// Figma node 1478:16615
// Header: flex gap-[8px] items-center px-[16px] py-[8px] border-b — ESTIMATE / AMOUNT / DATE / STATUS
// Row: relative flex gap-[8px] items-center px-[16px] py-[8px] border-b group
// Estimate name: flex-1 min-w-[180px] body-2 text-content-subtle underline
// Amount:        flex-1 max-w-[140px] body-2 text-content-subtle
// Date:          w-[110px] shrink-0 body-2 text-content-subtle whitespace-nowrap
// Status badge:  flex-1 max-w-[90px] rounded-[100px] pl-[10px] pr-[12px] py-[4px] h-[25px] — group-hover:opacity-0 for sendable rows
// Send button:   absolute right-[16px] opacity-0 group-hover:opacity-100 — bg-brand-action pl-[10px] pr-[12px] py-[8px] rounded-[12px] gap-[4px] Mail 14px body-3 text-content-invert
// Footer:        px-[16px] py-[4px] body-3 text-content-disabled
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

// Rows that can trigger the send flow on hover
function isSendable(statusKey) {
  return statusKey === 'drafted' || statusKey === 'pending' || statusKey === 'sent'
}

export default function EstimatesTable({
  estimates = [],
  onSend,
  onFollowUp,
  showOppTitle = false,
}) {
  return (
    <div className="w-full overflow-x-auto">
      {/* Header */}
      <div className="flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border">
        <p className="flex-[1_0_0] min-w-[180px] font-crm text-body-3 text-content uppercase tracking-wide">Estimate</p>
        <p className="flex-[1_0_0] max-w-[140px] min-w-0 font-crm text-body-3 text-content uppercase tracking-wide">Amount</p>
        <p className="w-[110px] shrink-0 font-crm text-body-3 text-content uppercase tracking-wide">Date</p>
        <p className="flex-[1_0_0] max-w-[90px] min-w-0 font-crm text-body-3 text-content uppercase tracking-wide">Status</p>
      </div>

      {/* Empty state */}
      {estimates.length === 0 ? (
        <p className="px-[16px] py-[12px] font-crm text-body-3 text-content-disabled">No estimates yet.</p>
      ) : (
        <>
          {estimates.map((est, i) => {
            const statusKey = est.status?.toLowerCase()
            const sendable = isSendable(statusKey)
            const sendAction = statusKey === 'drafted' ? onSend : onFollowUp

            return (
              <div
                key={est.id || i}
                className="relative flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border last:border-0 group"
              >
                {/* Estimate name */}
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
                <p className="flex-[1_0_0] max-w-[140px] min-w-0 font-crm text-body-2 text-content-subtle">
                  {formatCurrency(est.amount)}
                </p>

                {/* Date */}
                <p className="w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap">
                  {format(parseISO(est.date), 'MMM d, yyyy')}
                </p>

                {/* Status badge — fades on hover for sendable rows */}
                <div className={`flex-[1_0_0] max-w-[90px] min-w-0 transition-opacity ${sendable && sendAction ? 'group-hover:opacity-0' : ''}`}>
                  <Badge variant="status" value={statusKey} label={est.status} />
                </div>

                {/* Send button — appears on hover for sendable rows */}
                {sendable && sendAction && (
                  <button
                    type="button"
                    onClick={() => sendAction(est)}
                    className="absolute right-[16px] top-1/2 -translate-y-1/2 flex items-center gap-[4px] pl-[10px] pr-[12px] py-[8px] rounded-[12px] bg-brand-action text-content-invert opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-action-hover"
                  >
                    <Mail size={14} />
                    <span className="font-crm text-body-3 whitespace-nowrap">Send</span>
                  </button>
                )}
              </div>
            )
          })}

          {/* Footer */}
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
