import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Mail, Pencil } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import IconActivityType from '../components/ui/IconActivityType'
import { format, parseISO } from 'date-fns'
import { contacts } from '../data/mockData'
import { useApp } from '../context/AppContext'
import Badge from '../components/ui/Badge'
import PhoneModal from '../components/ui/PhoneModal'
import BackLink from '../components/ui/BackLink'
import TabsV from '../components/ui/TabsV'
import AddTask from '../components/ui/AddTask'
import UpcomingTasks from '../components/ui/UpcomingTasks'
import ActivitiesContainer from '../components/ui/ActivitiesContainer'
import Button from '../components/ui/Button'
import FormActions from '../components/ui/FormActions'
import OpportunityCard from '../components/ui/OpportunityCard'
import NotesFeed from '../components/ui/NotesFeed'
import NoteComposePanel from '../components/ui/NoteComposePanel'
import AccountDrawer from '../components/ui/AccountDrawer'
import OpportunityDrawer from '../components/ui/OpportunityDrawer'


export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { opportunities, notes, addNote, togglePinNote, completedTaskIds, completeTask, saveTaskForLater, accounts } = useApp()

  const contact = contacts.find(c => c.id === id)
  const [localContact, setLocalContact] = useState(contact ? { ...contact } : null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [activeTab, setActiveTab] = useState('opportunities')
  const [showCompose, setShowCompose] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [localTasks, setLocalTasks] = useState([])
  const [phoneModal, setPhoneModal] = useState({ isOpen: false })
  const [activitySearch, setActivitySearch] = useState('')
  const [showAccountDrawer, setShowAccountDrawer] = useState(false)
  const [selectedOpp, setSelectedOpp] = useState(null)

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#838383]">Contact not found.</p>
        <button onClick={() => navigate('/contacts')} className="text-sm text-[#2B6B52] font-medium hover:underline">
          Back to Contacts
        </button>
      </div>
    )
  }

  const linkedAccount = accounts?.find(a => a.id === contact.accountId)

  function formatRevenue(val) {
    if (!val) return '—'
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`
    if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`
    return `$${val}`
  }

  const contactOpps = opportunities.filter(o => o.contactId === id)
  const activeOpps = contactOpps.filter(o => o.status !== 'won' && o.status !== 'lost')
  const contactActivities = contactOpps.flatMap(o => o.activities?.log ?? [])
  const contactNotes = (notes || [])
    .filter(n => n.entityType === 'contact' && n.entityId === id)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
  const relatedOpps = activeOpps.map(o => ({ id: o.id, title: o.title }))

  function addTask() {
    if (!newTask.trim()) return
    setLocalTasks(prev => [...prev, { id: `lt-${Date.now()}`, task: newTask, dueDate: '', isSuggested: false }])
    setNewTask('')
  }

  const TABS = ['opportunities', 'activities', 'notes']

  return (
    <div className="flex flex-col gap-5">
      {/* Back + Edit row */}
      <div className="flex items-center justify-between">
        <BackLink label="Back to Contacts" onClick={() => navigate('/contacts')} />
        <div className="flex items-center gap-2">
          {isEditing ? (
            <FormActions
              onSave={() => { setLocalContact(prev => ({ ...prev, ...draft })); setIsEditing(false) }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Button
              icon={Pencil}
              onClick={() => {
                setDraft({
                  name: localContact.name,
                  title: localContact.title || '',
                  phone: localContact.phone || '',
                  email: localContact.email || '',
                  location: localContact.location || '',
                  preferredCommunication: localContact.preferredCommunication || '',
                  engagement: localContact.engagement || '',
                  accountOwner: localContact.accountOwner || '',
                })
                setIsEditing(true)
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left panel — 3 stacked cards */}
        <div className="flex-[2] min-w-0 flex flex-col gap-[12px] self-start sticky top-20">

          {/* Card 1 — Header */}
          <div className="border border-border rounded-card bg-surface-elevated px-[16px] py-[12px] flex flex-col gap-[4px]">
            <div className="flex items-center gap-[6px] flex-wrap">
              <h1 className="font-crm text-h6 font-bold text-content">{localContact.name}</h1>
              {localContact.location && (
                <>
                  <span className="font-crm text-body-2 text-content-subtlest">·</span>
                  <span className="font-crm text-body-2 text-content-subtlest">{localContact.location}</span>
                </>
              )}
            </div>
            <p className="font-crm text-body-2 text-content-subtle">
              <span className="italic">{localContact.title}</span>
              {linkedAccount && (
                <>
                  <span className="italic"> at </span>
                  <button
                    onClick={() => setShowAccountDrawer(true)}
                    className="font-bold italic underline [text-decoration-skip-ink:none] text-content-subtle hover:text-content transition-colors"
                  >
                    {contact.account}
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Card 2 — Contact Information */}
          <div className="border border-border rounded-card bg-surface-elevated px-[8px] py-[12px]">
            <div className="flex flex-col gap-[16px] px-[8px] w-full">
              <p className="font-crm text-body-2 font-bold text-content">Contact Information</p>

              <div className="flex flex-col gap-[16px] w-full">
                {/* Email */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start justify-center min-w-0 mr-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Email</span>
                      {localContact.preferredCommunication === 'Email' && (
                        <span className="font-crm text-[12px] font-medium text-content-primary bg-brand border border-border-primary rounded-[100px] pl-[10px] pr-[12px] py-[4px] whitespace-nowrap shrink-0">
                          Preferred
                        </span>
                      )}
                    </div>
                    <p className="font-crm text-body-2 text-content w-full">{localContact.email || '—'}</p>
                  </div>
                  <IconActivityType
                    type="mail"
                    hasLabel
                    onClick={() => { window.location.href = `mailto:${localContact.email}` }}
                  />
                </div>

                {/* Mobile */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col items-start min-w-0 mr-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Mobile</span>
                      {localContact.preferredCommunication === 'Phone' && (
                        <span className="font-crm text-[12px] font-medium text-content-primary bg-brand border border-border-primary rounded-[100px] pl-[10px] pr-[12px] py-[4px] whitespace-nowrap shrink-0">
                          Preferred
                        </span>
                      )}
                    </div>
                    <p className="font-crm text-body-2 text-content whitespace-nowrap">{localContact.phone || '—'}</p>
                  </div>
                  <IconActivityType
                    type="call"
                    hasLabel
                    onClick={() => setPhoneModal({ isOpen: true })}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border w-full" />

              {/* Engagement */}
              <div className="flex flex-col gap-[4px] items-start">
                <span className="font-crm text-body-3 text-content-subtlest">Engagement</span>
                <span
                  className="font-crm text-body-2 rounded-badge px-[8px] py-[2px] whitespace-nowrap"
                  style={{
                    backgroundColor: localContact.engagement === 'Responsive' ? '#EBFFD2' : localContact.engagement === 'Moderate' ? '#FEF3C7' : '#F3F4F6',
                    color: localContact.engagement === 'Responsive' ? '#3A531C' : localContact.engagement === 'Moderate' ? '#D97706' : '#9CA3AF',
                  }}
                >
                  {localContact.engagement || '—'}
                </span>
              </div>

              {/* Last contacted */}
              <div className="flex flex-col h-[48px] items-start justify-center">
                <span className="font-crm text-body-3 text-content-subtlest w-full">Last contacted</span>
                <div className="flex items-center gap-[16px] w-full">
                  <p className="font-crm text-body-2 text-content whitespace-nowrap">
                    {contact.lastContacted ? format(parseISO(contact.lastContacted), 'MMM d, yyyy') : '—'}
                  </p>
                  {contact.lastActivity && (
                    <div className="flex items-center gap-[8px]">
                      <div className="bg-brand rounded-badge p-[4px] size-[20px] flex items-center justify-center shrink-0">
                        <Mail size={10} className="text-content-primary" />
                      </div>
                      <p className="font-crm text-body-3 text-content-subtle whitespace-nowrap">{contact.lastActivity}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account owner */}
              <div className="flex flex-col h-[48px] items-start justify-center">
                <span className="font-crm text-body-3 text-content-subtlest">Account owner</span>
                <p className="font-crm text-body-2 text-content whitespace-nowrap">{localContact.accountOwner || '—'}</p>
              </div>
            </div>
          </div>

          {/* Card 3 — Account */}
          {linkedAccount && (
            <div className="border border-border rounded-card bg-surface-elevated px-[8px] py-[12px]">
              <div className="flex flex-col gap-[14px] px-[8px] w-full">
                <button
                  onClick={() => setShowAccountDrawer(true)}
                  className="font-crm text-body-2 font-bold text-content hover:text-content-subtle transition-colors text-left whitespace-nowrap"
                >
                  {linkedAccount.name}
                </button>

                {linkedAccount.overview && (
                  <p className="font-crm text-body-3 text-content-subtle overflow-hidden line-clamp-4">
                    <span className="font-bold">Overview: </span>
                    {linkedAccount.overview}
                  </p>
                )}

                <div className="flex flex-wrap gap-x-[24px] gap-y-[16px]">
                  {linkedAccount.address && (
                    <div className="flex flex-col items-start justify-center">
                      <span className="font-crm text-body-3 text-content-subtlest">Address</span>
                      <p className="font-crm text-body-2 text-content">{linkedAccount.address}</p>
                    </div>
                  )}
                  <div className="flex flex-col items-start justify-center">
                    <span className="font-crm text-body-3 text-content-subtlest">Annual revenue</span>
                    <p className="font-crm text-body-2 text-content">{formatRevenue(linkedAccount.annualRevenue)}</p>
                  </div>
                  {linkedAccount.status && (
                    <div className="flex flex-col items-start">
                      <span className="font-crm text-body-3 text-content-subtlest">Status</span>
                      <span className="font-crm text-body-2 bg-safe text-safe-bold rounded-badge px-[8px] py-[2px] whitespace-nowrap">
                        {linkedAccount.status}
                      </span>
                    </div>
                  )}
                  {linkedAccount.type && (
                    <div className="flex flex-col items-start justify-center h-[48px]">
                      <span className="font-crm text-body-3 text-content-subtlest">Type</span>
                      <p className="font-crm text-body-2 text-content">{linkedAccount.type}</p>
                    </div>
                  )}
                  {linkedAccount.industry && (
                    <div className="flex flex-col items-start">
                      <span className="font-crm text-body-3 text-content-subtlest">Industry</span>
                      <p className="font-crm text-body-2 text-content whitespace-nowrap">{linkedAccount.industry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right panel: single card — Tabs */}
        <div className="flex-[3] min-w-0 bg-surface-elevated rounded-card shadow-card overflow-hidden">
          <TabsV tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Opportunities Tab */}
          {activeTab === 'opportunities' && (() => {
            const historyOpps = contactOpps.filter(o => o.status === 'won' || o.status === 'lost')
            return (
              <div className="p-[20px] flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <span className="self-start font-crm text-body-3 text-content-subtlest bg-surface border border-border rounded-[8px] px-[6px] py-[2px] mb-[4px]">Active</span>
                  {activeOpps.length === 0 ? (
                    <p className="font-crm text-body-3 text-content-disabled">No active opportunities for {contact.name}.</p>
                  ) : (
                    activeOpps.map(opp => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        onClick={() => setSelectedOpp(opp)}
                      />
                    ))
                  )}
                </div>

                {historyOpps.length > 0 && (
                  <div className="flex flex-col gap-[4px] pb-[24px]">
                    <span className="self-start font-crm text-body-3 text-content-subtlest bg-surface border border-border rounded-[8px] px-[6px] py-[2px] mb-[4px]">History</span>
                    {historyOpps.map(opp => (
                      <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="flex flex-col gap-4 pt-4">
              <AddTask
                value={newTask}
                onChange={setNewTask}
                onAdd={addTask}
                placeholder="Add a task..."
              />

              <UpcomingTasks
                tasks={localTasks}
                completedTaskIds={completedTaskIds}
                onComplete={completeTask}
                onSaveLater={(task) => saveTaskForLater({ ...task, contact: contact.name, account: contact.account })}
                onTaskClick={task => {
                  const opp = opportunities.find(o => o.id === task.opportunityId)
                  if (opp) setSelectedOpp(opp)
                }}
                emptyMessage="No upcoming tasks. Add one above."
              />

              <ActivitiesContainer
                activities={contactActivities}
                search={activitySearch}
                onSearchChange={setActivitySearch}
              />
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <NotesFeed
              notes={contactNotes}
              onAddNote={() => setShowCompose(true)}
              onTogglePin={togglePinNote}
            />
          )}
        </div>
      </div>

      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={() => setPhoneModal({ isOpen: false })}
        contact={contact.name}
        phone={contact.phone}
        company={contact.account}
      />

      <NoteComposePanel
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSave={noteData => addNote('contact', id, noteData)}
        entityContext={{
          type: 'contact',
          bids: [],
          relatedOpps,
        }}
      />

      <AnimatePresence>
        {showAccountDrawer && linkedAccount && (
          <AccountDrawer
            account={linkedAccount}
            onClose={() => setShowAccountDrawer(false)}
            onViewDetail={() => { navigate(`/accounts/${contact.accountId}`); setShowAccountDrawer(false) }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOpp && (
          <OpportunityDrawer
            opp={selectedOpp}
            onClose={() => setSelectedOpp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
