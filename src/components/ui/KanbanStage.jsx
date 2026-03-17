import { Plus, TrendingUp } from 'lucide-react'
import KanbanCard from './KanbanCard'

// Figma node 652:34328
// Container: w-[266px], flex-col, gap-[12px]
// Column header: bg rgba(255,255,255,0.7), rounded-[8px], p-[12px]
//   Stage name: 18px bold #565656 + count 14px/21px #565656 + Plus 24px right
//   Total: 22px/33px bold #232323
//   Divider: 1px #e5e5e5
//   AI summary: gap-[16px] h-[42px]; TrendingUp 20px + text 14px/21px #565656
// Cards container: bg rgba(255,255,255,0.7), rounded-[8px], p-[12px], gap-[10px], overflow-y-auto

function formatTotal(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  return `$${val.toLocaleString()}`
}

export default function KanbanStage({ stage, opps, total, insight, onAdd, onCardClick }) {
  return (
    <div className="flex flex-col shrink-0" style={{ width: 266, gap: 12 }}>
      {/* Column header */}
      <div
        className="rounded-[8px] flex flex-col shrink-0"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: 12, gap: 12 }}
      >
        <div className="flex flex-col" style={{ gap: 0 }}>
          {/* Stage name + count + plus */}
          <div className="flex items-end justify-between shrink-0 w-full">
            <div className="flex items-end" style={{ gap: 8 }}>
              <p
                className="font-crm font-bold whitespace-nowrap"
                style={{ fontSize: 18, lineHeight: 'normal', color: '#565656' }}
              >
                {stage}
              </p>
              <p
                className="font-crm whitespace-nowrap"
                style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}
              >
                {opps.length}
              </p>
            </div>
            <button
              onClick={onAdd}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#414141', flexShrink: 0 }}
            >
              <Plus size={24} strokeWidth={1.75} />
            </button>
          </div>

          {/* Total amount */}
          <p
            className="font-crm font-bold whitespace-nowrap"
            style={{ fontSize: 22, lineHeight: '33px', color: '#232323' }}
          >
            {formatTotal(total)}
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#e5e5e5', width: '100%', flexShrink: 0 }} />

        {/* AI summary */}
        <div className="flex items-center shrink-0" style={{ gap: 12, minHeight: 42 }}>
          <TrendingUp size={20} color="#565656" strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <p className="font-crm flex-1" style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}>
            {insight}
          </p>
        </div>
      </div>

      {/* Cards container */}
      <div
        className="rounded-[8px] flex flex-col overflow-y-auto"
        style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: 12, gap: 10 }}
      >
        {opps.map(opp => (
          <KanbanCard key={opp.id} opp={opp} onClick={onCardClick} />
        ))}
        {opps.length === 0 && (
          <p
            className="font-crm text-center"
            style={{ fontSize: 14, lineHeight: '21px', color: '#838383', paddingTop: 32, paddingBottom: 32 }}
          >
            No opportunities
          </p>
        )}
      </div>
    </div>
  )
}
