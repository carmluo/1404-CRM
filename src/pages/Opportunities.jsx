import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { parseISO } from 'date-fns'
import { useApp } from '../context/AppContext'
import { accounts as mockAccounts } from '../data/mockData'
import OpportunityDrawer from '../components/ui/OpportunityDrawer'
import FilterPanel from '../components/ui/FilterPanel'
import CreateOpportunityModal from '../components/ui/CreateOpportunityModal'
import OpportunitySearchFilter from '../components/ui/OpportunitySearchFilter'
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
      {/* Search / Filter bar — Figma node 1477:18239 */}
      <div className="mb-5">
        <OpportunitySearchFilter
          query={query}
          onQueryChange={setQuery}
          owner={ownerFilter}
          onOwner={setOwnerFilter}
          sort={sort}
          onSort={setSort}
          onFilterClick={() => setIsFilterOpen(true)}
          onNewOpportunity={() => setIsCreateOpen(true)}
        />
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
