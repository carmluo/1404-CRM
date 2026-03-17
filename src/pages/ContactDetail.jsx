import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mail, Phone, Linkedin, MapPin, Building2,
  MessageSquare, Pencil,
} from 'lucide-react'
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


export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { opportunities, notes, addNote, togglePinNote, completedTaskIds, completeTask, saveTaskForLater } = useApp()

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
        {/* Left panel */}
        <div className="flex-[2] min-w-0 bg-white rounded-[8px] shadow-card p-6 flex flex-col gap-5 self-start sticky top-20">
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: '#2B6B52' }}
            >
              {localContact.name.charAt(0)}
            </div>
            <div className="w-full">
              {isEditing ? (
                <>
                  <input
                    value={draft.name}
                    onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full text-center font-bold text-[#21272a]"
                  />
                  <input
                    value={draft.title}
                    onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                    placeholder="Job title"
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full text-center mt-1"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-[#21272a]">{localContact.name}</h1>
                  <p className="text-sm text-[#838383] mt-0.5">{localContact.title}</p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a href={`mailto:${localContact.email}`} className="p-2 rounded-lg hover:bg-gray-100 text-[#838383] transition-colors" title="Email">
                <Mail size={16} />
              </a>
              <button
                onClick={() => setPhoneModal({ isOpen: true })}
                className="p-2 rounded-lg hover:bg-gray-100 text-[#838383] transition-colors"
                title="Call"
              >
                <Phone size={16} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-[#838383] transition-colors" title="LinkedIn">
                <Linkedin size={16} />
              </button>
            </div>
          </div>


          <div className="h-px bg-[#e5e5e5]" />

          {/* Contact info */}
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-[#838383] shrink-0" />
              <button
                onClick={() => navigate(`/accounts/${contact.accountId}`)}
                className="text-[#2B6B52] font-medium hover:underline"
              >
                {contact.account}
              </button>
            </div>
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#838383] shrink-0" />
                  <input
                    value={draft.phone}
                    onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                    placeholder="Phone"
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#838383] shrink-0" />
                  <input
                    value={draft.email}
                    onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                    placeholder="Email"
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#838383] shrink-0" />
                  <input
                    value={draft.location}
                    onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
                    placeholder="Location"
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-[#838383] shrink-0" />
                  <select
                    value={draft.preferredCommunication}
                    onChange={e => setDraft(d => ({ ...d, preferredCommunication: e.target.value }))}
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full"
                  >
                    <option value="">Select...</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                {localContact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#838383] shrink-0" />
                    <span className="text-[#565656]">{localContact.phone}</span>
                  </div>
                )}
                {localContact.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-[#838383] shrink-0" />
                    <a href={`mailto:${localContact.email}`} className="text-[#565656] hover:text-[#2B6B52]">{localContact.email}</a>
                  </div>
                )}
                {localContact.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#838383] shrink-0" />
                    <span className="text-[#565656]">{localContact.location}</span>
                  </div>
                )}
                {localContact.preferredCommunication && (
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-[#838383] shrink-0" />
                    <span className="text-[#565656]">Preferred: <span className="font-medium text-[#21272a]">{localContact.preferredCommunication}</span></span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="h-px bg-[#e5e5e5]" />

          {/* Engagement + meta */}
          <div className="flex flex-col gap-3">
            {isEditing ? (
              <>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-[#838383] shrink-0">Engagement</span>
                  <select
                    value={draft.engagement}
                    onChange={e => setDraft(d => ({ ...d, engagement: e.target.value }))}
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full"
                  >
                    <option value="">Select...</option>
                    <option value="Responsive">Responsive</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Weak">Weak</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-sm gap-2">
                  <span className="text-[#838383] shrink-0">Account owner</span>
                  <input
                    value={draft.accountOwner}
                    onChange={e => setDraft(d => ({ ...d, accountOwner: e.target.value }))}
                    placeholder="Account owner"
                    className="border border-[#dde1e6] rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#2B6B52] w-full"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#838383]">Engagement</span>
                  <Badge variant="engagement" value={localContact.engagement} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#838383]">Last contacted</span>
                  <span className="font-medium text-[#21272a] text-xs">
                    {contact.lastContacted ? format(parseISO(contact.lastContacted), 'MMM d, yyyy') : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#838383]">Account owner</span>
                  <span className="font-medium text-[#21272a] text-xs">{localContact.accountOwner}</span>
                </div>
                {contact.lastActivity && (
                  <div className="mt-1">
                    <p className="text-xs text-[#838383] mb-1">Last activity</p>
                    <p className="text-xs text-[#565656] italic">{contact.lastActivity}</p>
                  </div>
                )}
              </>
            )}
          </div>
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
                        onClick={() => navigate(`/opportunities/${opp.id}`)}
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
            <div className="p-4">
              <NotesFeed
                notes={contactNotes}
                onAddNote={() => setShowCompose(true)}
                onTogglePin={togglePinNote}
              />
            </div>
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
    </div>
  )
}
