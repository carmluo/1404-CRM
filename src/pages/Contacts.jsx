import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { contacts as mockContacts } from '../data/mockData'
import FilterPanel from '../components/ui/FilterPanel'
import PhoneModal from '../components/ui/PhoneModal'
import ContactDrawer from '../components/ui/ContactDrawer'
import CreateContactModal from '../components/ui/CreateContactModal'
import ContactSearchFilter from '../components/ui/ContactSearchFilter'
import ContactsTable from '../components/ui/ContactsTable'
import { nlSearchContacts } from '../utils/nlSearch'

const PAGE_SIZE = 10

export default function Contacts() {
  const [query, setQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(0)
  const [phoneModal, setPhoneModal] = useState({ isOpen: false, contact: '', phone: '', company: '' })
  const [selectedContact, setSelectedContact] = useState(null)
  const [newContacts, setNewContacts] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const contacts = [...newContacts, ...mockContacts]
  const filtered = nlSearchContacts(contacts, query)

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortKey] || ''
      let bVal = b[sortKey] || ''
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
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <h1 className="font-crm text-h5 font-bold text-content">Contacts</h1>

      {/* Search + Filter bar */}
      <ContactSearchFilter
        query={query}
        onQueryChange={val => { setQuery(val); setPage(0) }}
        onFilterClick={() => setIsFilterOpen(true)}
        onNewContact={() => setIsCreateOpen(true)}
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
      <ContactsTable
        contacts={paged}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        page={page}
        totalPages={totalPages}
        totalCount={sorted.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onRowClick={setSelectedContact}
        onEmail={cnt => { if (cnt.email) window.location.href = `mailto:${cnt.email}` }}
        onPhone={cnt => setPhoneModal({ isOpen: true, contact: cnt.name, phone: cnt.phone, company: cnt.account })}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        context="contacts"
      />

      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={() => setPhoneModal({ isOpen: false, contact: '', phone: '', company: '' })}
        contact={phoneModal.contact}
        phone={phoneModal.phone}
        company={phoneModal.company}
      />

      <AnimatePresence>
        {selectedContact && (
          <ContactDrawer
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
          />
        )}
      </AnimatePresence>

      <CreateContactModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAdd={cnt => setNewContacts(prev => [cnt, ...prev])}
      />
    </div>
  )
}
