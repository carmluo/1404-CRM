import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import {
  Pencil,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { accounts, contacts as allContacts } from '../data/mockData'
import { useApp } from '../context/AppContext'
import Badge from '../components/ui/Badge'
import PhoneModal from '../components/ui/PhoneModal'
import BackLink from '../components/ui/BackLink'
import TabsV from '../components/ui/TabsV'
import AddTask from '../components/ui/AddTask'
import UpcomingTasks from '../components/ui/UpcomingTasks'
import Button from '../components/ui/Button'
import FormActions from '../components/ui/FormActions'
import AccountHeader from '../components/ui/AccountHeader'
import ContactsCard from '../components/ui/ContactsCard'
import ActivitiesContainer from '../components/ui/ActivitiesContainer'
import EstimatesTable from '../components/ui/EstimatesTable'
import CreateEstimateModal from '../components/ui/CreateEstimateModal'
import EmailDraftModal from '../components/ui/EmailDraftModal'
import OpportunityCard from '../components/ui/OpportunityCard'
import NotesFeed from '../components/ui/NotesFeed'
import NoteComposePanel from '../components/ui/NoteComposePanel'
import EstimatesToolbar from '../components/ui/EstimatesToolbar'
import ContactDrawer from '../components/ui/ContactDrawer'
import OpportunityDrawer from '../components/ui/OpportunityDrawer'


const MOCK_OPP_HISTORY = [
  { title: 'Legacy Fixture Rollout', amount: 480000, status: 'won', closeDate: '2024-11-01' },
  { title: 'Initial Store Setup', amount: 220000, status: 'lost', closeDate: '2024-06-15' },
]


export default function AccountDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { opportunities, notes, addNote, togglePinNote, completedTaskIds, completeTask, saveTaskForLater } = useApp()

  const account = accounts.find(a => a.id === id)
  const [localAccount, setLocalAccount] = useState(account ? { ...account } : null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [activeTab, setActiveTab] = useState('opportunities')
  const [showCompose, setShowCompose] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [localTasks, setLocalTasks] = useState([])
  const [phoneModal, setPhoneModal] = useState({ isOpen: false })
  const [activitySearch, setActivitySearch] = useState('')
  const [dismissedSuggested, setDismissedSuggested] = useState([])
  const [acceptedSuggested, setAcceptedSuggested] = useState([])
  const [showCreateEstimate, setShowCreateEstimate] = useState(false)
  const [emailDraft, setEmailDraft] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedOpp, setSelectedOpp] = useState(null)

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#838383]">Account not found.</p>
        <button onClick={() => navigate('/accounts')} className="text-sm text-[#2B6B52] font-medium hover:underline">
          Back to Accounts
        </button>
      </div>
    )
  }

  const accountOpps = opportunities.filter(o => o.accountId === id)
  const activeOpps = accountOpps.filter(o => o.status !== 'won' && o.status !== 'lost')
  const accountActivities = accountOpps.flatMap(o => o.activities?.log ?? [])
  const accountNotes = (notes || [])
    .filter(n => n.entityType === 'account' && n.entityId === id)
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

  const TABS = ['opportunities', 'estimates', 'activities', 'notes']

  return (
    <div className="flex flex-col gap-5">
      {/* Back + Edit row */}
      <div className="flex items-center justify-between">
        <BackLink label="Back to Accounts" onClick={() => navigate('/accounts')} />
        <div className="flex items-center gap-2">
          {isEditing ? (
            <FormActions
              onSave={() => { setLocalAccount(prev => ({ ...prev, ...draft })); setIsEditing(false) }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Button
              icon={Pencil}
              onClick={() => {
                setDraft({
                  name: localAccount.name,
                  overview: localAccount.overview || '',
                  address: localAccount.address || '',
                  annualRevenue: localAccount.annualRevenue,
                  industry: localAccount.industry || '',
                  type: localAccount.type || '',
                  status: localAccount.status || '',
                  website: localAccount.website || '',
                  linkedin: localAccount.linkedin || '',
                  facebook: localAccount.facebook || '',
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
        {/* Left panel */}
        <div
          className="flex-[2] min-w-0 flex flex-col gap-[32px] self-start sticky top-20"
        >
          <AccountHeader
            name={localAccount.name}
            overview={localAccount.overview}
            address={localAccount.address}
            annualRevenue={localAccount.annualRevenue}
            status={localAccount.status}
            type={localAccount.type}
            industry={localAccount.industry}
            website={account.website}
            linkedin={account.linkedin}
            facebook={account.facebook}
            isEditing={isEditing}
            draft={draft}
            onDraftChange={changes => setDraft(d => ({ ...d, ...changes }))}
          />

          {/* Contacts + Suggested Contacts */}
          <ContactsCard
            contacts={account.contacts || []}
            suggestedContacts={account.suggestedContacts || []}
            dismissedSuggested={dismissedSuggested}
            acceptedSuggested={acceptedSuggested}
            onContactClick={cnt => {
              const fullContact = allContacts.find(c => c.id === cnt.id) || cnt
              setSelectedContact(fullContact)
            }}
            onEmail={cnt => window.location.href = `mailto:${cnt.email}`}
            onPhone={cnt => setPhoneModal({ isOpen: true, contact: cnt.name, phone: cnt.phone, company: account.name })}
            onAcceptSuggested={name => setAcceptedSuggested(prev => [...prev, name])}
            onDismissSuggested={name => setDismissedSuggested(prev => [...prev, name])}
          />
        </div>

        {/* Right panel: single card — Tabs */}
        <div className="flex-[3] min-w-0 bg-surface-elevated rounded-card shadow-card overflow-hidden">
          <TabsV tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Opportunities Tab */}
          {activeTab === 'opportunities' && (
            <div className="p-[20px] flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[4px]">
                <span className="self-start font-crm text-body-3 text-content-subtlest bg-surface border border-border rounded-[8px] px-[6px] py-[2px] mb-[4px]">Active</span>
                {activeOpps.length === 0 ? (
                  <p className="font-crm text-body-3 text-content-disabled">No active opportunities.</p>
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

              <div className="flex flex-col gap-[4px] pb-[24px]">
                <span className="self-start font-crm text-body-3 text-content-subtlest bg-surface border border-border rounded-[8px] px-[6px] py-[2px] mb-[4px]">History</span>
                {MOCK_OPP_HISTORY.map((opp, i) => (
                  <OpportunityCard key={i} opportunity={opp} />
                ))}
              </div>
            </div>
          )}

          {/* Estimates Tab */}
          {activeTab === 'estimates' && (() => {
            const allEstimates = accountOpps.flatMap(o =>
              (o.estimates || []).map(e => ({ ...e, oppId: o.id, oppTitle: o.title }))
            )
            const accountContact = allContacts.find(c =>
              account.contacts?.some(ac => ac.id === c.id)
            )
            return (
              <div className="p-4 flex flex-col gap-4">
                <EstimatesToolbar onCreateNew={() => setShowCreateEstimate(true)} />
                <EstimatesTable
                  estimates={allEstimates}
                  showOppTitle
                  onSend={est => {
                    const contact = allContacts.find(c =>
                      accountOpps.find(o => o.id === est.oppId)?.contactId === c.id
                    ) || accountContact
                    setEmailDraft({ estimate: est, mode: 'send', oppId: est.oppId, oppTitle: est.oppTitle, contactName: contact?.name, contactEmail: contact?.email })
                  }}
                  onFollowUp={est => {
                    const contact = allContacts.find(c =>
                      accountOpps.find(o => o.id === est.oppId)?.contactId === c.id
                    ) || accountContact
                    setEmailDraft({ estimate: est, mode: 'followup', oppId: est.oppId, oppTitle: est.oppTitle, contactName: contact?.name, contactEmail: contact?.email })
                  }}
                />
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
                onSaveLater={(task) => saveTaskForLater({ ...task, account: account.name })}
                onTaskClick={task => {
                  const opp = opportunities.find(o => o.id === task.opportunityId)
                  if (opp) setSelectedOpp(opp)
                }}
                emptyMessage="No upcoming tasks. Add one above."
              />

              <ActivitiesContainer
                activities={accountActivities}
                search={activitySearch}
                onSearchChange={setActivitySearch}
              />
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <NotesFeed
              notes={accountNotes}
              onAddNote={() => setShowCompose(true)}
              onTogglePin={togglePinNote}
            />
          )}
        </div>
      </div>

      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={() => setPhoneModal({ isOpen: false })}
        contact={phoneModal.contact}
        phone={phoneModal.phone}
        company={phoneModal.company}
      />

      <CreateEstimateModal
        isOpen={showCreateEstimate}
        onClose={() => setShowCreateEstimate(false)}
        accountName={account.name}
        opps={activeOpps.map(o => ({ id: o.id, title: o.title }))}
      />

      <EmailDraftModal
        isOpen={!!emailDraft}
        onClose={() => setEmailDraft(null)}
        oppId={emailDraft?.oppId}
        estimate={emailDraft?.estimate}
        mode={emailDraft?.mode}
        contactName={emailDraft?.contactName}
        contactEmail={emailDraft?.contactEmail}
        oppTitle={emailDraft?.oppTitle}
      />

      <NoteComposePanel
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSave={noteData => addNote('account', id, noteData)}
        entityContext={{
          type: 'account',
          bids: [],
          relatedOpps,
        }}
      />

      <AnimatePresence>
        {selectedContact && (
          <ContactDrawer
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
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
