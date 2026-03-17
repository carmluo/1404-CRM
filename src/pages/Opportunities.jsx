import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  Search, SlidersHorizontal, Plus, X,
  ArrowUpDown, Bookmark, BookmarkCheck, Trash2, Check, ArrowUp, ArrowDown,
} from 'lucide-react'
import { parseISO } from 'date-fns'
import { useApp } from '../context/AppContext'
import { accounts as mockAccounts } from '../data/mockData'
import OpportunityDrawer from '../components/ui/OpportunityDrawer'
import FilterPanel from '../components/ui/FilterPanel'
import CreateOpportunityModal from '../components/ui/CreateOpportunityModal'
import Button from '../components/ui/Button'
import KanbanStage from '../components/ui/KanbanStage'
import { nlSearchOpportunities } from '../utils/nlSearch'

const STAGES = ['Qualifying', 'Needs Analysis', 'Estimate Prep', 'Estimate Submitted', 'Negotiation', 'Verbal Commit']

const STAGE_COLORS = {
  'Qualifying': '#5BBFA0',
  'Needs Analysis': '#9C59C5',
  'Estimate Prep': '#4A8FE0',
  'Estimate Submitted': '#F5A623',
  'Negotiation': '#8A9D35',
  'Verbal Commit': '#7B5EA7',
}

const STAGE_INSIGHTS = {
  'Qualifying': 'Early inquiries require more key details',
  'Needs Analysis': 'Gather requirements before moving forward',
  'Estimate Prep': '3 estimates overdue — review priority',
  'Estimate Submitted': 'Follow up within 5 business days',
  'Negotiation': 'High win rate when closed within 30 days',
  'Verbal Commit': 'Contracts ready to send — push to close',
}

const SORT_OPTIONS = [
  { label: 'Value', field: 'value', dir: 'desc', icon: ArrowDown },
  { label: 'Value', field: 'value', dir: 'asc',  icon: ArrowUp },
  { label: 'Close Date', field: 'closeDate', dir: 'asc',  icon: ArrowUp },
  { label: 'Close Date', field: 'closeDate', dir: 'desc', icon: ArrowDown },
  { label: 'Recent Activity', field: 'activity', dir: 'desc', icon: ArrowDown },
  { label: 'Recent Activity', field: 'activity', dir: 'asc',  icon: ArrowUp },
]

function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

function sortOpps(opps, sort) {
  if (!sort) return opps
  return [...opps].sort((a, b) => {
    if (sort.field === 'value') {
      return sort.dir === 'desc' ? b.amount - a.amount : a.amount - b.amount
    }
    if (sort.field === 'closeDate') {
      const da = a.closeDate ? parseISO(a.closeDate).getTime() : Infinity
      const db = b.closeDate ? parseISO(b.closeDate).getTime() : Infinity
      return sort.dir === 'asc' ? da - db : db - da
    }
    if (sort.field === 'activity') {
      const la = a.activities?.log?.[0]?.date ? parseISO(a.activities.log[0].date).getTime() : 0
      const lb = b.activities?.log?.[0]?.date ? parseISO(b.activities.log[0].date).getTime() : 0
      return sort.dir === 'desc' ? lb - la : la - lb
    }
    return 0
  })
}

// ─── Owner Filter ─────────────────────────────────────────────────────────────
const OWNERS = ['Marcus Reynolds', 'Sarah Kim']

function OwnerFilter({ owner, onOwner }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <Button withChevron active={!!owner} onClick={() => setOpen(o => !o)}>
        {owner ? owner.split(' ')[0] : 'Owner'}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-20 bg-white rounded-xl border border-border shadow-card overflow-hidden" style={{ minWidth: 180 }}>
            <button
              onClick={() => { onOwner(null); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-crm text-body-3 hover:bg-surface transition-colors"
              style={{ color: !owner ? '#326757' : '#414141', fontWeight: !owner ? 600 : 400 }}
            >
              All Owners
              {!owner}
            </button>
            {OWNERS.map(o => (
              <button
                key={o}
                onClick={() => { onOwner(o); setOpen(false) }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left font-crm text-body-3 hover:bg-surface transition-colors"
                style={{ color: owner === o ? '#326757' : '#414141', fontWeight: owner === o ? 600 : 400 }}
              >
                {o}
                {owner === o }
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Sort Dropdown ────────────────────────────────────────────────────────────
function SortDropdown({ sort, onSort }) {
  const [open, setOpen] = useState(false)
  const isActive = !!sort

  const activeLabel = sort
    ? `${sort.label} ${sort.dir === 'desc' ? '↓' : '↑'}`
    : null

  return (
    <div className="relative">
      <Button
        icon={ArrowUpDown}
        active={isActive}
        onClick={() => setOpen(o => !o)}
      >
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
            className="absolute right-0 top-full mt-1.5 z-20 bg-white rounded-lg border border-[#e5e5e5] shadow-lg overflow-hidden"
            style={{ minWidth: 200 }}
          >
            <p className="px-3 pt-2.5 pb-1 text-xs font-semibold text-[#838383] uppercase tracking-wide">Sort by</p>
            {[
              { heading: 'Value', opts: SORT_OPTIONS.filter(o => o.field === 'value') },
              { heading: 'Close Date', opts: SORT_OPTIONS.filter(o => o.field === 'closeDate') },
              { heading: 'Recent Activity', opts: SORT_OPTIONS.filter(o => o.field === 'activity') },
            ].map(group => (
              <div key={group.heading}>
                <p className="px-3 pt-2 pb-0.5 text-xs text-[#838383]">{group.heading}</p>
                {group.opts.map(opt => {
                  const Icon = opt.icon
                  const active = sort?.field === opt.field && sort?.dir === opt.dir
                  return (
                    <button
                      key={`${opt.field}-${opt.dir}`}
                      onClick={() => { onSort({ ...opt }); setOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-[#f4f4f4] transition-colors"
                      style={{ color: active ? '#2B6B52' : '#232323', fontWeight: active ? 600 : 400 }}
                    >
                      <Icon size={13} style={{ opacity: 0.6 }} />
                      {opt.dir === 'desc' ? 'High to Low' : 'Low to High'}
                      {opt.field === 'closeDate' && opt.dir === 'asc' && '(Soonest)'}
                      {opt.field === 'closeDate' && opt.dir === 'desc' && '(Latest)'}
                      {opt.field === 'activity' && opt.dir === 'desc' && '(Most Recent)'}
                      {opt.field === 'activity' && opt.dir === 'asc' && '(Least Recent)'}
                      {active && <Check size={13} className="ml-auto" style={{ color: '#2B6B52' }} />}
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

// ─── Saved Filters Dropdown ───────────────────────────────────────────────────
function SavedFiltersDropdown({ query, onApply }) {
  const [open, setOpen] = useState(false)
  const [savedFilters, setSavedFilters] = useState([
    { id: 'sf1', name: 'Stalled deals', query: 'stalled' },
    { id: 'sf2', name: 'Overdue', query: 'overdue' },
  ])
  const [saving, setSaving] = useState(false)
  const [saveName, setSaveName] = useState('')

  function saveCurrentFilter() {
    if (!saveName.trim()) return
    setSavedFilters(prev => [
      ...prev,
      { id: `sf${Date.now()}`, name: saveName.trim(), query },
    ])
    setSaveName('')
    setSaving(false)
  }

  function deleteFilter(id) {
    setSavedFilters(prev => prev.filter(f => f.id !== id))
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
            className="absolute left-0 top-full mt-1.5 z-20 bg-white rounded-lg border border-[#e5e5e5] shadow-lg"
            style={{ minWidth: 240 }}
          >
            {/* Saved list */}
            {savedFilters.length > 0 ? (
              <div className="py-1">
                <p className="px-3 pt-2 pb-1 text-xs font-semibold text-[#838383] uppercase tracking-wide">Saved</p>
                {savedFilters.map(f => (
                  <div
                    key={f.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#f4f4f4] group transition-colors"
                  >
                    <BookmarkCheck size={13} style={{ color: '#2B6B52', flexShrink: 0 }} />
                    <button
                      className="flex-1 text-left text-sm text-[#232323] truncate"
                      onClick={() => { onApply(f.query); setOpen(false) }}
                    >
                      {f.name}
                    </button>
                    <span className="text-xs text-[#838383] shrink-0">{f.query}</span>
                    <button
                      onClick={() => deleteFilter(f.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[#838383] hover:text-[#EF4444] shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <div className="mx-3 my-1 h-px bg-[#f0f0f0]" />
              </div>
            ) : (
              <p className="px-3 pt-3 pb-1 text-xs text-[#838383]">No saved filters yet</p>
            )}

            {/* Save current */}
            {!saving ? (
              <button
                onClick={() => setSaving(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#2B6B52] font-medium hover:bg-[#f4f4f4] transition-colors"
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
                  onKeyDown={e => { if (e.key === 'Enter') saveCurrentFilter(); if (e.key === 'Escape') setSaving(false) }}
                  placeholder="Filter name..."
                  className="w-full text-sm border border-[#dde1e6] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#2B6B52] mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveCurrentFilter}
                    className="flex-1 py-1.5 rounded-lg text-xs text-white font-medium"
                    style={{ backgroundColor: '#2B6B52' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setSaving(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#565656] border border-[#e5e5e5]"
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Opportunities() {
  const [searchParams] = useSearchParams()
  const { opportunities } = useApp()
  const [query, setQuery] = useState('')
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [sort, setSort] = useState(null)   // { field, dir, label }
  const [ownerFilter, setOwnerFilter] = useState(null)

  const stageParam = searchParams.get('stage')

  const accountOwnerMap = Object.fromEntries(mockAccounts.map(a => [a.id, a.accountOwner]))
  const searchedOpps = nlSearchOpportunities(opportunities, query)
  const filteredOpps = ownerFilter
    ? searchedOpps.filter(o => accountOwnerMap[o.accountId] === ownerFilter)
    : searchedOpps

  function getStageOpps(stage) {
    const base = filteredOpps.filter(o => o.stage === stage)
    return sortOpps(base, sort)
  }

  function getStageTotal(stage) {
    return filteredOpps.filter(o => o.stage === stage).reduce((sum, o) => sum + o.amount, 0)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search / Filter bar — Figma node 1001:7392 */}
      <div className="flex items-start justify-between mb-5 gap-3">
        {/* Left: search pill + owner filter */}
        <div className="flex gap-[12px] items-center">
          <div
            className="flex items-center gap-[8px] bg-white rounded-[100px] pl-[16px] pr-[8px] py-[8px] cursor-text"
            onClick={() => document.getElementById('opp-search').focus()}
          >
            <input
              id="opp-search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={'Ask about your pipeline... "which deals are stalled?"'}
              className="bg-transparent font-crm text-body-3 text-content placeholder:text-content-disabled focus:outline-none w-[430px]"
            />
            {query
              ? <button onClick={e => { e.stopPropagation(); setQuery('') }} className="text-content-disabled hover:text-content shrink-0"><X size={18} /></button>
              : <Search size={24} strokeWidth={1.5} className="shrink-0 text-content-disabled" />
            }
          </div>
          <OwnerFilter owner={ownerFilter} onOwner={setOwnerFilter} />
        </div>

        {/* Right: saved filters + advanced filters + sort + new */}
        <div className="flex gap-[12px] items-center">
          <SavedFiltersDropdown query={query} onApply={q => setQuery(q)} />
          <Button icon={SlidersHorizontal} onClick={() => setIsFilterOpen(true)}>
            Advanced filters
          </Button>
          <SortDropdown sort={sort} onSort={setSort} />
        </div>
      </div>

      {/* Active sort indicator */}
      {sort && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-[#838383]">Sorted by</span>
          <span
            className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
            style={{ backgroundColor: '#E8F5F0', color: '#2B6B52' }}
          >
            {sort.label} · {sort.dir === 'desc' ? '↓ High to Low' : '↑ Low to High'}
          </span>
          <button
            onClick={() => setSort(null)}
            className="text-xs text-[#838383] hover:text-[#21272a] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1 items-start">
        {STAGES.map(stage => (
          <KanbanStage
            key={stage}
            stage={stage}
            opps={getStageOpps(stage)}
            total={getStageTotal(stage)}
            insight={STAGE_INSIGHTS[stage]}
            onAdd={() => setIsCreateOpen(true)}
            onCardClick={setSelectedOpp}
          />
        ))}
      </div>

      {/* Opportunity Drawer */}
      <AnimatePresence>
        {selectedOpp && (
          <OpportunityDrawer opp={selectedOpp} onClose={() => setSelectedOpp(null)} />
        )}
      </AnimatePresence>

      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} context="opportunities" />
      <CreateOpportunityModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  )
}
