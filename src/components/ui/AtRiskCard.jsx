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
        className="rounded-[8px] w-full shrink-0"
        style={{ backgroundColor: '#f2f2f2', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}
      >
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col />
            <col style={{ width: 100 }} />
            <col style={{ width: 85 }} />
            <col style={{ width: 162 }} />
          </colgroup>
          <thead>
            <tr>
              <th className="text-left" style={{ paddingLeft: 16, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                <span className="font-crm font-medium uppercase" style={{ fontSize: 12, lineHeight: 1, color: '#838383' }}>Opportunity</span>
              </th>
              <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                <span className="font-crm font-medium uppercase" style={{ fontSize: 12, lineHeight: 1, color: '#838383' }}>Contact</span>
              </th>
              <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                <span className="font-crm font-medium uppercase inline-flex items-center" style={{ fontSize: 12, lineHeight: 1, color: '#838383', gap: 4 }}>
                  <ArrowDownUp size={14} />
                  Amount
                </span>
              </th>
              <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                <span className="font-crm font-medium uppercase" style={{ fontSize: 12, lineHeight: 1, color: '#838383' }}>Status</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const isLast = i === items.length - 1
              const borderStyle = isLast ? 'none' : '1px solid #e5e5e5'
              return (
                <tr
                  key={item.id}
                  className="cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  style={{ borderBottom: borderStyle }}
                  onClick={() => onRowClick?.(item.id)}
                >
                  <td style={{ paddingLeft: 16, paddingRight: 8, paddingTop: 12, paddingBottom: 12 }}>
                    <span className="font-crm block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}>
                      {item.opportunity}
                    </span>
                  </td>
                  <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12 }}>
                    <span className="font-crm block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}>
                      {item.contact}
                    </span>
                  </td>
                  <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12, whiteSpace: 'nowrap' }}>
                    <span className="font-crm" style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}>
                      {formatAmount(item.amount)}
                    </span>
                  </td>
                  <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 8, paddingBottom: 8 }}>
                    <Tag
                      label={STATUS_LABELS[item.status] ?? item.status}
                      state="unselected"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
