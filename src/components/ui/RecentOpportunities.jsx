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
        className="rounded-[8px] w-full overflow-x-auto"
        style={{ backgroundColor: '#f2f2f2', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}
      >
        <div
          className="grid w-full"
          style={{ gridTemplateColumns: '191px fit-content(100%) fit-content(100%) minmax(0, 1fr)' }}
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
            className="font-crm font-medium uppercase text-right"
            style={{ padding: 10, borderBottom: '1px solid #e5e5e5', fontSize: 12, lineHeight: 1, color: '#838383' }}
          >
            Amount
          </div>
          <div
            className="font-crm font-medium uppercase text-right flex items-center justify-end"
            style={{ padding: 10, borderBottom: '1px solid #e5e5e5', fontSize: 12, lineHeight: 1, color: '#838383', gap: 4 }}
          >
            <ArrowDownUp size={14} />
            {toggle === 'created' ? 'Created' : 'Updated'}
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
                    className="font-crm whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ fontSize: 14, lineHeight: '21px', color: '#21272a', maxWidth: '100%' }}
                  >
                    {item.title}
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
                    style={{ fontSize: 14, lineHeight: '21px', color: '#21272a', maxWidth: 62 }}
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
                    className="font-crm whitespace-nowrap"
                    style={{ fontSize: 14, lineHeight: '21px', color: '#697077' }}
                  >
                    {formatAmount(item.amount)}
                  </span>
                </div>
                <div
                  key={`${item.id}-date`}
                  className="flex items-center justify-end cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 12, paddingBottom: 12, borderBottom: borderStyle }}
                  onClick={() => onRowClick?.(item.id)}
                >
                  <span
                    className="font-crm whitespace-nowrap"
                    style={{ fontSize: 14, lineHeight: '21px', color: '#697077' }}
                  >
                    {format(parseISO(item.date), 'MM/dd/yy')}
                  </span>
                </div>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}
