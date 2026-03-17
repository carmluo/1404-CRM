// Figma node 1091:55406 — account table
// Grid: minmax(180px,1fr) repeat(6,140px)
// Header: px-[16px] py-[12px] min-h-[67px] border-b border-border
// Row:    px-[16px] py-[20px] border-b border-border
// Footer: px-[16px] py-[20px]
// All text: font-crm text-body-2 — headers text-content-subtlest, cells text-content
import { format, parseISO } from 'date-fns'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'

function formatCurrency(val) {
  if (!val && val !== 0) return '$0'
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  return `$${val}`
}

function SortArrow({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={12} className="text-content-disabled" />
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-content-subtlest" />
    : <ChevronDown size={12} className="text-content-subtlest" />
}

// Shared grid template — 7 columns
const COLS = 'grid grid-cols-[minmax(180px,1fr)_repeat(6,140px)] gap-x-4'

const DATA_COLS = [
  { key: 'type',          label: 'Type' },
  { key: 'lastActivity',  label: 'Last activity' },
  { key: 'commStrength',  label: 'Comm. strength' },
  { key: 'pipelineValue', label: 'Value' },
  { key: 'pipeline',      label: 'Pipeline' },
  { key: 'accountOwner',  label: 'Account owner' },
]

export default function AccountTable({
  accounts = [],
  sortKey,
  sortDir,
  onSort,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onRowClick,
}) {
  const start = totalCount === 0 ? 0 : page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, totalCount)

  return (
    <div className="w-full rounded-card overflow-hidden bg-surface-elevated shadow-card overflow-x-auto">
      <div className="min-w-[900px]">

        {/* ── Header ── */}
        <div className={`${COLS} border-b border-border px-[16px] py-[12px] min-h-[67px] items-center w-full`}>
          <button
            onClick={() => onSort('name')}
            className="flex items-center gap-[3px] font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Account name
            <span className="p-[4px]"><SortArrow col="name" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
          {DATA_COLS.map(col => (
            <button
              key={col.key}
              onClick={() => onSort(col.key)}
              className="flex items-center font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
            >
              {col.label}
              <span className="p-[4px]"><SortArrow col={col.key} sortKey={sortKey} sortDir={sortDir} /></span>
            </button>
          ))}
        </div>

        {/* ── Data rows ── */}
        {accounts.length === 0 ? (
          <div className="px-[16px] py-[20px]">
            <p className="font-crm text-body-2 text-content-disabled">No accounts found.</p>
          </div>
        ) : (
          accounts.map(acc => {
            const pipeline = (acc.activeOpportunities ?? 0) > 0 ? 'Active' : 'Inactive'
            return (
              <button
                key={acc.id}
                onClick={() => onRowClick?.(acc)}
                className={`${COLS} border-b border-border px-[16px] py-[20px] items-center w-full hover:bg-surface-hover transition-colors text-left last:border-0`}
              >
                <p className="font-crm text-body-2 text-content truncate pr-2">{acc.name}</p>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">{acc.type}</p>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">
                  {acc.lastActivity ? format(parseISO(acc.lastActivity), 'MMM d, yyyy') : '—'}
                </p>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">{acc.commStrength}</p>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">{formatCurrency(acc.pipelineValue)}</p>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">{pipeline}</p>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">{acc.accountOwner}</p>
              </button>
            )
          })
        )}

        {/* ── Pagination footer ── */}
        <div className="px-[16px] py-[20px] flex items-center justify-between w-full">
          <p className="font-crm text-body-2 text-content-disabled">
            Showing {start}–{end} of {totalCount}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(Math.max(0, page - 1))}
              disabled={page === 0}
              className="flex items-center justify-center size-[20px] text-content-subtlest hover:text-content disabled:text-content-disabled transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`w-[27px] h-[27px] flex items-center justify-center font-crm text-body-2 rounded-[4px] transition-colors ${
                  page === i
                    ? 'bg-surface text-content font-bold'
                    : 'text-content-subtle hover:bg-surface'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center justify-center size-[20px] text-content-subtlest hover:text-content disabled:text-content-disabled transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
