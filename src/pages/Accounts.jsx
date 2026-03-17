import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'
import { accounts as mockAccounts } from '../data/mockData'
import FilterPanel from '../components/ui/FilterPanel'
import AccountDrawer from '../components/ui/AccountDrawer'
import CreateAccountModal from '../components/ui/CreateAccountModal'
import AccountSearchFilter from '../components/ui/AccountSearchFilter'
import AccountTable from '../components/ui/AccountTable'
import { nlSearchAccounts } from '../utils/nlSearch'


function getCommStrength(account) {
  const contacts = account.contacts || []
  if (!contacts.length) return 'Weak'
  const lastContacted = contacts.map(c => c.lastContacted).filter(Boolean).sort().reverse()[0]
  if (!lastContacted) return 'Weak'
  const days = differenceInDays(new Date(), parseISO(lastContacted))
  if (days <= 14) return 'Strong'
  if (days <= 45) return 'Moderate'
  return 'Weak'
}

const PAGE_SIZE = 10

export default function Accounts() {
  const [query, setQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [newAccounts, setNewAccounts] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Enrich accounts with computed commStrength for display + sorting
  const enriched = useMemo(() =>
    [...newAccounts, ...mockAccounts].map(acc => ({
      ...acc,
      commStrength: getCommStrength(acc),
    })),
    [newAccounts]
  )

  const filtered = nlSearchAccounts(enriched, query)

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal, bVal
      if (sortKey === 'pipeline') {
        aVal = (a.activeOpportunities ?? 0) > 0 ? 1 : 0
        bVal = (b.activeOpportunities ?? 0) > 0 ? 1 : 0
      } else {
        aVal = a[sortKey]
        bVal = b[sortKey]
      }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <h1 className="font-crm text-h5 font-bold text-content">Accounts</h1>

      {/* Search + Filter bar */}
      <AccountSearchFilter
        query={query}
        onQueryChange={val => { setQuery(val); setPage(0) }}
        onFilterClick={() => setIsFilterOpen(true)}
        onNewAccount={() => setIsCreateOpen(true)}
      />

      {query && (
        <div className="flex items-center gap-2">
          <span className="font-crm text-body-3 text-content-disabled">Showing results for:</span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-badge bg-surface font-crm text-body-3 text-content-subtle border border-border">
            "{query}" <button onClick={() => { setQuery(''); setPage(0) }}><X size={11} /></button>
          </span>
        </div>
      )}

      {/* Table */}
      <AccountTable
        accounts={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        page={page}
        totalPages={totalPages}
        totalCount={sorted.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onRowClick={setSelectedAccount}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        context="accounts"
      />

      <AnimatePresence>
        {selectedAccount && (
          <AccountDrawer
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
          />
        )}
      </AnimatePresence>

      <CreateAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAdd={acc => setNewAccounts(prev => [acc, ...prev])}
      />
    </div>
  )
}
