// Figma node 1091:69954 — contacts table
// Grid: 350px repeat(5,140px) 110px
// Header: px-[16px] py-[12px] min-h-[67px] border-b border-border
// Row:    p-[16px] border-b border-border
// Name:   bold text-body-2, italic text-body-3 title — no avatar
// Action icons: IconActivityType mail + call, gap-[4px]
import { format, parseISO } from 'date-fns'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import IconActivityType from './IconActivityType'

function SortArrow({ col, sortKey, sortDir }) {
  if (sortKey !== col) return <ChevronsUpDown size={12} className="text-content-disabled" />
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-content-subtlest" />
    : <ChevronDown size={12} className="text-content-subtlest" />
}

// Shared grid template — 7 columns
// Name(350px) | Account | Last contacted | Location | Preferred | Actions | Account owner(110px)
const COLS = 'grid grid-cols-[350px_repeat(5,140px)_110px] gap-x-4'

export default function ContactsTable({
  contacts = [],
  sortKey,
  sortDir,
  onSort,
  page,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onRowClick,
  onEmail,
  onPhone,
}) {
  const start = totalCount === 0 ? 0 : page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, totalCount)

  return (
    <div className="w-full rounded-[8px] overflow-hidden bg-surface-elevated shadow-card overflow-x-auto">
      <div className="min-w-[1100px]">

        {/* ── Header ── */}
        <div className={`${COLS} border-b border-border px-[16px] py-[12px] min-h-[67px] items-center w-full`}>
          <button
            onClick={() => onSort('name')}
            className="flex items-center gap-[3px] font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Name
            <span className="p-[4px]"><SortArrow col="name" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
          <button
            onClick={() => onSort('account')}
            className="flex items-center font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Account
            <span className="p-[4px]"><SortArrow col="account" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
          <button
            onClick={() => onSort('lastContacted')}
            className="flex items-center font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Last contacted
            <span className="p-[4px]"><SortArrow col="lastContacted" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
          <button
            onClick={() => onSort('location')}
            className="flex items-center font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Location
            <span className="p-[4px]"><SortArrow col="location" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
          <button
            onClick={() => onSort('preferredCommunication')}
            className="flex items-center font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Preferred
            <span className="p-[4px]"><SortArrow col="preferredCommunication" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
          {/* Actions — no sort */}
          <div className="font-crm text-body-2 text-content-subtlest whitespace-nowrap">
            Actions
          </div>
          <button
            onClick={() => onSort('accountOwner')}
            className="flex items-center font-crm text-body-2 text-content-subtlest whitespace-nowrap text-left"
          >
            Account owner
            <span className="p-[4px]"><SortArrow col="accountOwner" sortKey={sortKey} sortDir={sortDir} /></span>
          </button>
        </div>

        {/* ── Data rows ── */}
        {contacts.length === 0 ? (
          <div className="px-[16px] py-[20px]">
            <p className="font-crm text-body-2 text-content-disabled">No contacts found.</p>
          </div>
        ) : (
          contacts.map(cnt => (
            <div
              key={cnt.id}
              onClick={() => onRowClick?.(cnt)}
              className={`${COLS} border-b border-border px-[16px] py-[16px] items-center w-full hover:bg-surface-hover transition-colors cursor-pointer last:border-0`}
            >
              {/* Name + title — no avatar per Figma */}
              <div className="flex flex-col items-start min-w-0">
                <p className="font-crm text-body-2 font-bold text-content-subtle whitespace-nowrap">{cnt.name}</p>
                <p className="font-crm text-body-3 italic text-content-subtlest whitespace-nowrap">{cnt.title}</p>
              </div>

              <p className="font-crm text-body-2 text-content whitespace-nowrap">{cnt.account}</p>

              <p className="font-crm text-body-2 text-content whitespace-nowrap">
                {cnt.lastContacted ? format(parseISO(cnt.lastContacted), 'MMM d, yyyy') : '—'}
              </p>

              <p className="font-crm text-body-2 text-content whitespace-nowrap">{cnt.location || '—'}</p>

              <p className="font-crm text-body-2 text-content whitespace-nowrap">{cnt.preferredCommunication || '—'}</p>

              {/* Actions — stop row click propagation */}
              <div
                className="flex items-center gap-[4px]"
                onClick={e => e.stopPropagation()}
              >
                <IconActivityType type="mail" onClick={() => onEmail?.(cnt)} />
                <IconActivityType type="call" onClick={() => onPhone?.(cnt)} />
              </div>

              <p className="font-crm text-body-2 text-content whitespace-nowrap">{cnt.accountOwner}</p>
            </div>
          ))
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
