// Figma node 1477:18239 — search-filter
// Layout: justify-between, full-width
// Left:  search-input (rounded-[100px]) + Owner dropdown — gap-[12px]
// Right: Saved filters + Advanced filters + Sort + New opportunity — gap-[12px]
import { useState } from 'react'
import {
  Search, SlidersHorizontal, Plus, X,
  ArrowUpDown, Bookmark, BookmarkCheck, Trash2, Check, ArrowUp, ArrowDown,
} from 'lucide-react'
import Button from './Button'

const OWNERS = ['Marcus Reynolds', 'Sarah Kim']

export const SORT_OPTIONS = [
  { label: 'Value',           field: 'value',     dir: 'desc', Icon: ArrowDown },
  { label: 'Value',           field: 'value',     dir: 'asc',  Icon: ArrowUp },
  { label: 'Close Date',      field: 'closeDate', dir: 'asc',  Icon: ArrowUp },
  { label: 'Close Date',      field: 'closeDate', dir: 'desc', Icon: ArrowDown },
  { label: 'Recent Activity', field: 'activity',  dir: 'desc', Icon: ArrowDown },
  { label: 'Recent Activity', field: 'activity',  dir: 'asc',  Icon: ArrowUp },
]

// ─── Owner dropdown ───────────────────────────────────────────────────────────
function OwnerFilter({ owner, onOwner }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative self-stretch flex items-stretch">
      <Button withChevron active={!!owner} onClick={() => setOpen(o => !o)}>
        {owner ? owner.split(' ')[0] : 'Owner'}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full mt-1.5 z-20 bg-surface-white rounded-xl border border-border shadow-card overflow-hidden"
            style={{ minWidth: 180 }}
          >
            <button
              onClick={() => { onOwner(null); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-crm text-body-3 hover:bg-surface transition-colors"
              style={{ color: !owner ? '#326757' : '#414141', fontWeight: !owner ? 600 : 400 }}
            >
              All Owners
            </button>
            {OWNERS.map(o => (
              <button
                key={o}
                onClick={() => { onOwner(o); setOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-crm text-body-3 hover:bg-surface transition-colors"
                style={{ color: owner === o ? '#326757' : '#414141', fontWeight: owner === o ? 600 : 400 }}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────
function SortDropdown({ sort, onSort }) {
  const [open, setOpen] = useState(false)
  const isActive = !!sort

  const activeLabel = sort
    ? `${sort.label} ${sort.dir === 'desc' ? '↓' : '↑'}`
    : null

  return (
    <div className="relative">
      <Button icon={ArrowUpDown} active={isActive} onClick={() => setOpen(o => !o)}>
        {activeLabel ?? 'Sort'}
        {isActive && (
          <span
            className="ml-0.5 hover:opacity-60"
            onClick={e => { e.stopPropagation(); onSort(null) }}
          >
            <X size={12} />
          </span>
        )}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1.5 z-20 bg-surface-white rounded-xl border border-border shadow-card overflow-hidden"
            style={{ minWidth: 200 }}
          >
            <p className="px-3 pt-2.5 pb-1 font-crm text-body-3 font-semibold text-content-disabled uppercase tracking-wide" style={{ fontSize: 11 }}>Sort by</p>
            {[
              { heading: 'Value',           opts: SORT_OPTIONS.filter(o => o.field === 'value') },
              { heading: 'Close Date',      opts: SORT_OPTIONS.filter(o => o.field === 'closeDate') },
              { heading: 'Recent Activity', opts: SORT_OPTIONS.filter(o => o.field === 'activity') },
            ].map(group => (
              <div key={group.heading}>
                <p className="px-3 pt-2 pb-0.5 font-crm text-body-3 text-content-disabled" style={{ fontSize: 12 }}>{group.heading}</p>
                {group.opts.map(opt => {
                  const Icon = opt.Icon
                  const active = sort?.field === opt.field && sort?.dir === opt.dir
                  return (
                    <button
                      key={`${opt.field}-${opt.dir}`}
                      onClick={() => { onSort({ ...opt }); setOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left font-crm text-body-3 hover:bg-surface transition-colors"
                      style={{ color: active ? '#2B6B52' : '#232323', fontWeight: active ? 600 : 400 }}
                    >
                      <Icon size={13} style={{ opacity: 0.6 }} />
                      {opt.dir === 'desc' ? 'High to Low' : 'Low to High'}
                      {opt.field === 'closeDate' && opt.dir === 'asc'  && ' (Soonest)'}
                      {opt.field === 'closeDate' && opt.dir === 'desc' && ' (Latest)'}
                      {opt.field === 'activity'  && opt.dir === 'desc' && ' (Most Recent)'}
                      {opt.field === 'activity'  && opt.dir === 'asc'  && ' (Least Recent)'}
                      {active && <Check size={13} className="ml-auto text-content-primary" />}
                    </button>
                  )
                })}
              </div>
            ))}
            <div className="h-2" />
          </div>
        </>
      )}
    </div>
  )
}

// ─── Saved filters dropdown ───────────────────────────────────────────────────
function SavedFiltersDropdown({ query, onApply }) {
  const [open, setOpen] = useState(false)
  const [savedFilters, setSavedFilters] = useState([
    { id: 'sf1', name: 'Stalled deals', query: 'stalled' },
    { id: 'sf2', name: 'Overdue',       query: 'overdue' },
  ])
  const [saving, setSaving] = useState(false)
  const [saveName, setSaveName] = useState('')

  function saveCurrentFilter() {
    if (!saveName.trim()) return
    setSavedFilters(prev => [...prev, { id: `sf${Date.now()}`, name: saveName.trim(), query }])
    setSaveName('')
    setSaving(false)
  }

  const hasActive = savedFilters.length > 0

  return (
    <div className="relative">
      <Button withChevron active={hasActive} onClick={() => setOpen(o => !o)}>
        Saved filters
        {hasActive && (
          <span
            className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold ml-1"
            style={{ backgroundColor: '#326757', fontSize: 10 }}
          >
            {savedFilters.length}
          </span>
        )}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setSaving(false) }} />
          <div
            className="absolute left-0 top-full mt-1.5 z-20 bg-surface-white rounded-xl border border-border shadow-card"
            style={{ minWidth: 240 }}
          >
            {savedFilters.length > 0 ? (
              <div className="py-1">
                <p className="px-3 pt-2 pb-1 font-crm text-body-3 font-semibold text-content-disabled uppercase tracking-wide" style={{ fontSize: 11 }}>Saved</p>
                {savedFilters.map(f => (
                  <div key={f.id} className="flex items-center gap-2 px-3 py-2 hover:bg-surface group transition-colors">
                    <BookmarkCheck size={13} className="text-content-primary shrink-0" />
                    <button
                      className="flex-1 text-left font-crm text-body-3 text-content truncate"
                      onClick={() => { onApply(f.query); setOpen(false) }}
                    >
                      {f.name}
                    </button>
                    <span className="font-crm text-content-disabled shrink-0" style={{ fontSize: 12 }}>{f.query}</span>
                    <button
                      onClick={() => setSavedFilters(prev => prev.filter(x => x.id !== f.id))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-content-disabled hover:text-danger-text shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <div className="mx-3 my-1 h-px bg-border" />
              </div>
            ) : (
              <p className="px-3 pt-3 pb-1 font-crm text-body-3 text-content-disabled">No saved filters yet</p>
            )}
            {!saving ? (
              <button
                onClick={() => setSaving(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 font-crm text-body-3 text-content-primary font-medium hover:bg-surface transition-colors"
                disabled={!query}
                style={{ opacity: query ? 1 : 0.4, cursor: query ? 'pointer' : 'not-allowed' }}
              >
                <Bookmark size={14} />
                Save current filter{query ? ` ("${query.slice(0, 18)}")` : ''}
              </button>
            ) : (
              <div className="px-3 py-2.5">
                <input
                  autoFocus
                  type="text"
                  value={saveName}
                  onChange={e => setSaveName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveCurrentFilter()
                    if (e.key === 'Escape') setSaving(false)
                  }}
                  placeholder="Filter name..."
                  className="w-full font-crm text-body-3 border border-border-input rounded-card px-2.5 py-1.5 focus:outline-none focus:border-border-primary mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveCurrentFilter}
                    className="flex-1 py-1.5 rounded-card font-crm text-body-3 text-content-invert bg-brand-action"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setSaving(false)}
                    className="px-3 py-1.5 rounded-card font-crm text-body-3 text-content-subtlest border border-border"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Main bar ─────────────────────────────────────────────────────────────────
export default function OpportunitySearchFilter({
  query,
  onQueryChange,
  owner,
  onOwner,
  sort,
  onSort,
  onFilterClick,
  onNewOpportunity,
}) {
  return (
    <div className="flex items-start justify-between w-full gap-3">

      {/* Left: search input + owner — gap-[12px] */}
      <div className="flex gap-[12px] items-start">
        {/* Search — rounded-[100px] pl-[16px] pr-[8px] py-[8px] gap-[8px] */}
        <div
          className="flex items-center gap-[8px] bg-surface-white rounded-[100px] pl-[16px] pr-[8px] py-[8px] cursor-text min-w-[300px]"
          onClick={() => document.getElementById('opp-search').focus()}
        >
          <input
            id="opp-search"
            type="text"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder='Ask about your pipeline... "which deals are stalled?"'
            className="flex-1 min-w-0 bg-transparent font-crm text-body-3 text-content placeholder:text-content-disabled focus:outline-none"
          />
          {query
            ? (
              <button
                onClick={e => { e.stopPropagation(); onQueryChange('') }}
                className="text-content-disabled hover:text-content shrink-0 flex items-center justify-center w-[24px] h-[24px]"
              >
                <X size={18} />
              </button>
            ) : (
              <div className="shrink-0 flex items-center justify-center w-[24px] h-[24px] text-content-disabled">
                <Search size={24} strokeWidth={1.5} />
              </div>
            )
          }
        </div>

        {/* Owner — self-stretch so it matches the search pill height */}
        <OwnerFilter owner={owner} onOwner={onOwner} />
      </div>

      {/* Right: filter buttons + CTA — gap-[12px] */}
      <div className="flex items-center gap-[12px] shrink-0">
        <SavedFiltersDropdown query={query} onApply={onQueryChange} />

        {/* Advanced filters — icon + label */}
        <Button icon={SlidersHorizontal} onClick={onFilterClick}>
          Advanced filters
        </Button>

        {/* Sort — icon + label, with active state */}
        <SortDropdown sort={sort} onSort={onSort} />

        {/* New opportunity — brand-primary */}
        <Button variant="brand-primary" icon={Plus} onClick={onNewOpportunity}>
          New opportunity
        </Button>
      </div>
    </div>
  )
}
