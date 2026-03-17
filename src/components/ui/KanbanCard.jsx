import { UsersRound, Clock, TriangleAlert } from 'lucide-react'
import { parseISO, differenceInDays, format } from 'date-fns'

// Figma node 652:34250
// Card: bg white, rounded-[4px], p-[8px], gap-[4px]
// Top row: account 14px #232323 | bidders (users-round 14px + count) | date (clock 14px + date) — justify-between
// Title: 18px/27px #232323
// Amount: 18px bold #232323
// Overdue tag: bg #fff5d8, rounded-[4px], px-[8px] py-[4px], triangle 16px, text 14px/21px #3d2b1d
// Activity: 14px/21px #565656 (no-activity) OR last activity left #414141 + age right #838383

const ACTIVITY_LABELS = {
  call: 'Call logged',
  email: 'Email sent',
  bid: 'Bid received',
  note: 'Note added',
  meeting: 'Meeting held',
}

function relativeAge(dateStr) {
  const days = differenceInDays(new Date(), parseISO(dateStr))
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? 's' : ''} ago`
}

export default function KanbanCard({ opp, onClick }) {
  const closeDate = opp.closeDate ? parseISO(opp.closeDate) : null
  const closeDateStr = closeDate ? format(closeDate, 'MMM d') : null
  const lastLog = opp.activities?.log?.[0]
  const isOverdue = opp.status === 'overdue'
  const isNoActivity = opp.status === 'no-activity'

  return (
    <div
      className="flex flex-col cursor-pointer"
      style={{ backgroundColor: 'white', borderRadius: 4, padding: 8, gap: 4 }}
      onClick={() => onClick?.(opp)}
    >
      {/* Top row */}
      <div className="flex items-center justify-between shrink-0 w-full" style={{ gap: 8, minWidth: 0 }}>
        <span
          className="font-crm overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ fontSize: 14, lineHeight: '21px', color: '#232323', minWidth: 0 }}
        >
          {opp.account}
        </span>
        <div className="flex items-center shrink-0" style={{ gap: 8 }}>
          {opp.bids?.length > 0 && (
            <div className="flex items-center" style={{ gap: 4 }}>
              <UsersRound size={14} color="#565656" strokeWidth={1.75} />
              <span className="font-crm whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}>
                {opp.bids.length} bid{opp.bids.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          {closeDateStr && (
            <div className="flex items-center" style={{ gap: 4 }}>
              <Clock size={14} color="#565656" strokeWidth={1.75} />
              <span className="font-crm whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}>
                {closeDateStr}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="font-crm shrink-0 w-full" style={{ fontSize: 18, lineHeight: '27px', color: '#232323' }}>
        {opp.title}
      </p>

      {/* Amount */}
      <p className="font-crm font-bold shrink-0" style={{ fontSize: 18, lineHeight: 'normal', color: '#232323' }}>
        ${opp.amount.toLocaleString()}
      </p>

      {/* Overdue tag */}
      {isOverdue && (
        <div
          className="flex items-center shrink-0"
          style={{ backgroundColor: '#fff5d8', borderRadius: 4, paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, gap: 6 }}
        >
          <TriangleAlert size={16} color="#9a6700" strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <span className="font-crm whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#3d2b1d' }}>
            Overdue by {opp.overdueBy} day{opp.overdueBy !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Activity line */}
      {isNoActivity ? (
        <p className="font-crm shrink-0" style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}>
          No activity for {opp.noActivityMonths} month{opp.noActivityMonths !== 1 ? 's' : ''}
        </p>
      ) : lastLog ? (
        <div
          className="flex items-end justify-between font-crm overflow-hidden whitespace-nowrap shrink-0 w-full"
          style={{ fontSize: 14, lineHeight: '21px' }}
        >
          <span className="flex-1 overflow-hidden text-ellipsis" style={{ color: '#414141' }}>
            {ACTIVITY_LABELS[lastLog.type] ?? lastLog.type}
          </span>
          <span className="shrink-0 ml-2" style={{ color: '#838383' }}>
            {relativeAge(lastLog.date)}
          </span>
        </div>
      ) : null}
    </div>
  )
}
