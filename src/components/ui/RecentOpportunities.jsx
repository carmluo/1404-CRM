import { useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { format, parseISO } from 'date-fns'

// Figma node 519:75735
// Container: bg rgba(255,255,255,0.7), rounded-[8px], p-[16px], gap-[8px]
// Header: Label/L1 18px bold #21272a + toggle bg-[#eae7e4] rounded-[8px] p-[4px] gap-[4px]
//   Active switch: bg-white rounded-[4px] shadow-[-1px_2px_2px_0px_rgba(0,0,0,0.03)] px-[10px] py-[6px]
//   Label: 12px medium #565656
// Table: bg-[#f2f2f2] rounded-[8px] px-[8px] py-[4px]
//   Grid: grid-cols-[191px_fit-content(100%)_fit-content(100%)_minmax(0,1fr)]
//   Headers: 12px medium uppercase #838383, py-[10px]
//   Rows: Body/B3 14px/21px, py-[12px], border-b #e5e5e5
//     Opportunity: #21272a pl-[16px] pr-[10px]
//     Contact: #21272a max-w-[62px] truncate right-aligned px-[10px]
//     Amount: #697077 right-aligned px-[10px]
//     Date: #697077 right-aligned px-[10px]

function formatAmount(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(2).replace(/\.?0+$/, '')}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val.toLocaleString()}`
}

export default function RecentOpportunities({ created = [], updated = [], onRowClick }) {
  const [toggle, setToggle] = useState('created')
  const items = toggle === 'created' ? created : updated

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
      <div className="flex items-center justify-between shrink-0 w-full">
        <p
          className="font-crm font-bold whitespace-nowrap"
          style={{ fontSize: 18, lineHeight: 'normal', color: '#21272a' }}
        >
          Recent Opportunities
        </p>

        {/* Toggle */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: '#eae7e4',
            borderRadius: 8,
            padding: 4,
            gap: 4,
          }}
        >
          {['created', 'updated'].map(t => (
            <button
              key={t}
              onClick={() => setToggle(t)}
              className="flex items-center justify-center transition-all duration-150"
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 6,
                paddingBottom: 6,
                borderRadius: 4,
                backgroundColor: toggle === t ? 'white' : 'transparent',
                boxShadow: toggle === t ? '-1px 2px 2px 0px rgba(0,0,0,0.03)' : 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                className="font-crm whitespace-nowrap capitalize"
                style={{ fontSize: 12, lineHeight: 'normal', color: '#565656', fontWeight: 500 }}
              >
                {t === 'created' ? 'Created' : 'Updated'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-[8px] w-full"
        style={{ backgroundColor: '#f2f2f2', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}
      >
        <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col />
            <col style={{ width: 100 }} />
            <col style={{ width: 85 }} />
            <col style={{ width: 93 }} />
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
                <span className="font-crm font-medium uppercase" style={{ fontSize: 12, lineHeight: 1, color: '#838383' }}>Amount</span>
              </th>
              <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                <span className="font-crm font-medium uppercase inline-flex items-center" style={{ fontSize: 12, lineHeight: 1, color: '#838383', gap: 4 }}>
                  <ArrowDownUp size={14} />
                  {toggle === 'created' ? 'Created' : 'Updated'}
                </span>
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
                    <span className="font-crm block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#21272a' }}>
                      {item.title}
                    </span>
                  </td>
                  <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12 }}>
                    <span className="font-crm block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#21272a' }}>
                      {item.contact}
                    </span>
                  </td>
                  <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12, whiteSpace: 'nowrap' }}>
                    <span className="font-crm" style={{ fontSize: 14, lineHeight: '21px', color: '#697077' }}>
                      {formatAmount(item.amount)}
                    </span>
                  </td>
                  <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12, whiteSpace: 'nowrap' }}>
                    <span className="font-crm" style={{ fontSize: 14, lineHeight: '21px', color: '#697077' }}>
                      {format(parseISO(item.date), 'MM/dd/yy')}
                    </span>
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
