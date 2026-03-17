import { ArrowDownUp } from 'lucide-react'
import Tag from './Tag'

// Figma node 1001:4463
// Container: bg rgba(255,255,255,0.7), rounded-[8px], p-[16px], gap-[8px]
// Header: Label/L1 18px bold #232323, h-[35px]
// Table: bg-[#f2f2f2] rounded-[8px] px-[8px] py-[4px]
//   Grid: grid-cols-[160px_minmax(0,1fr)_minmax(0,1fr)_fit-content(100%)]
//   Headers: 12px medium uppercase #838383
//   Rows: Body/B3 14px/21px, #414141, py-[12px], border-b #e5e5e5
//   Status col: Tag state=unselected, left-aligned

const STATUS_LABELS = {
  noActivity: 'No activity',
  overdue: 'Overdue follow up',
  unresolved: 'Unresolved question',
}

function formatAmount(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)} M`
  return `$${val.toLocaleString()}`
}

export default function AtRiskCard({ items = [], onRowClick }) {
  return (
    <div
      className="rounded-[8px] flex flex-col w-full"
      style={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 16,
        gap: 8,
      }}
    >
      {/* Header */}
      <div className="flex items-center shrink-0 w-full" style={{ height: 35 }}>
        <p
          className="font-crm font-bold whitespace-nowrap"
          style={{ fontSize: 18, lineHeight: 'normal', color: '#232323' }}
        >
          At-risk
        </p>
      </div>

      {/* Table */}
      <div
        className="rounded-[8px] w-full overflow-x-auto shrink-0"
        style={{ backgroundColor: '#f2f2f2', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}
      >
        <div
          className="grid w-full"
          style={{ gridTemplateColumns: '160px minmax(0,1fr) minmax(0,1fr) fit-content(100%)' }}
        >
          {/* Column headers */}
          <div
            className="font-crm font-medium uppercase"
            style={{ paddingLeft: 16, paddingRight: 10, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', fontSize: 12, lineHeight: 1, color: '#838383' }}
          >
            Opportunity
          </div>
          <div
            className="font-crm font-medium uppercase text-right"
            style={{ padding: 10, borderBottom: '1px solid #e5e5e5', fontSize: 12, lineHeight: 1, color: '#838383' }}
          >
            Contact
          </div>
          <div
            className="font-crm font-medium uppercase text-right flex items-center justify-end"
            style={{ padding: 10, borderBottom: '1px solid #e5e5e5', fontSize: 12, lineHeight: 1, color: '#838383', gap: 4 }}
          >
            <ArrowDownUp size={14} />
            Amount
          </div>
          <div
            className="font-crm font-medium uppercase"
            style={{ padding: 10, borderBottom: '1px solid #e5e5e5', fontSize: 12, lineHeight: 1, color: '#838383' }}
          >
            Status
          </div>

          {/* Rows */}
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            const borderStyle = isLast ? 'none' : '1px solid #e5e5e5'
            return (
              <>
                <div
                  key={`${item.id}-opp`}
                  className="flex items-center cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  style={{ paddingLeft: 16, paddingRight: 10, paddingTop: 12, paddingBottom: 12, borderBottom: borderStyle }}
                  onClick={() => onRowClick?.(item.id)}
                >
                  <span
                    className="font-crm overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ fontSize: 14, lineHeight: '21px', color: '#414141', flex: '1 0 0', minWidth: 0 }}
                  >
                    {item.opportunity}
                  </span>
                </div>
                <div
                  key={`${item.id}-contact`}
                  className="flex items-center justify-end cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 12, paddingBottom: 12, borderBottom: borderStyle }}
                  onClick={() => onRowClick?.(item.id)}
                >
                  <span
                    className="font-crm whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: 14, lineHeight: '21px', color: '#414141', maxWidth: 62 }}
                  >
                    {item.contact}
                  </span>
                </div>
                <div
                  key={`${item.id}-amount`}
                  className="flex items-center justify-end cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 12, paddingBottom: 12, borderBottom: borderStyle }}
                  onClick={() => onRowClick?.(item.id)}
                >
                  <span
                    className="font-crm whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: 14, lineHeight: '21px', color: '#414141', maxWidth: 62 }}
                  >
                    {formatAmount(item.amount)}
                  </span>
                </div>
                <div
                  key={`${item.id}-status`}
                  className="flex flex-col items-start justify-center cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8, borderBottom: borderStyle }}
                  onClick={() => onRowClick?.(item.id)}
                >
                  <Tag
                    label={STATUS_LABELS[item.status] ?? item.status}
                    state="unselected"
                  />
                </div>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}
