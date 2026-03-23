import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mail, X,
  Plus, Calendar, Pencil,
} from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import { useApp } from '../context/AppContext'
import Button from '../components/ui/Button'
import FormActions from '../components/ui/FormActions'
import OpportunityHeader from '../components/ui/OpportunityHeader'
import PhoneModal from '../components/ui/PhoneModal'
import BackLink from '../components/ui/BackLink'
import BiddingSection from '../components/ui/BiddingSection'
import UpcomingTasks from '../components/ui/UpcomingTasks'
import TabsV from '../components/ui/TabsV'
import ActivitiesContainer from '../components/ui/ActivitiesContainer'
import DocumentsTable from '../components/ui/DocumentsTable'
import EstimatesTable from '../components/ui/EstimatesTable'
import CreateEstimateModal from '../components/ui/CreateEstimateModal'
import EmailDraftModal from '../components/ui/EmailDraftModal'
import NotesFeed from '../components/ui/NotesFeed'
import NoteComposePanel from '../components/ui/NoteComposePanel'
import { contacts as allContacts } from '../data/mockData'


export default function OpportunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { opportunities, notes, addNote, togglePinNote, completedTaskIds, completeTask, saveTaskForLater } = useApp()

  const opp = opportunities.find(o => o.id === id)
  const oppNotes = (notes || [])
    .filter(n => n.entityType === 'opportunity' && n.entityId === id)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return b.createdAt.localeCompare(a.createdAt)
    })
  const [localOpp, setLocalOpp] = useState(opp ? { ...opp } : null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [activeTab, setActiveTab] = useState('activities')
  const [activitySearch, setActivitySearch] = useState('')
  const [newTask, setNewTask] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [showCompose, setShowCompose] = useState(false)
  const [phoneModal, setPhoneModal] = useState({ isOpen: false })
  const [localActivities, setLocalActivities] = useState(opp?.activities?.upcoming || [])
  const [showCreateEstimate, setShowCreateEstimate] = useState(false)
  const [emailDraft, setEmailDraft] = useState(null) // { estimate, mode }

  if (!opp) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#838383]">Opportunity not found.</p>
        <button onClick={() => navigate('/opportunities')} className="text-sm text-[#2B6B52] font-medium hover:underline">
          Back to Opportunities
        </button>
      </div>
    )
  }

  const today = new Date()
  const closeDate = localOpp.closeDate ? parseISO(localOpp.closeDate) : null
  const daysToClose = closeDate ? differenceInDays(closeDate, today) : null
  const stageEntryDate = opp.stageEntryDate ? parseISO(opp.stageEntryDate) : null
  const daysInStage = stageEntryDate ? differenceInDays(today, stageEntryDate) : 0

  const contact = allContacts.find(c => c.id === opp.contactId)

  function addTask() {
    if (!newTask.trim()) return
    setLocalActivities(prev => [
      ...prev,
      {
        id: `task-new-${Date.now()}`,
        task: newTask,
        dueDate: newTaskDueDate,
        isSuggested: false,
      }
    ])
    setNewTask('')
    setNewTaskDueDate('')
    setShowDueDatePicker(false)
  }

  const TABS = ['activities', 'documents', 'estimates', 'emails']

  return (
    <div className="flex flex-col gap-5">
      {/* Back + Edit row */}
      <div className="flex items-center justify-between">
        <BackLink label="Back to Opportunities" onClick={() => navigate('/opportunities')} />
        <div className="flex items-center gap-2">
          {isEditing ? (
            <FormActions
              onSave={() => { setLocalOpp(prev => ({ ...prev, ...draft })); setIsEditing(false) }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <Button
              icon={Pencil}
              onClick={() => {
                setDraft({
                  title: localOpp.title,
                  amount: localOpp.amount,
                  stage: localOpp.stage,
                  dealProbability: localOpp.dealProbability,
                  closeDate: localOpp.closeDate || '',
                  projectStart: localOpp.projectStart || '',
                })
                // dealProbability will auto-update when stage changes
                setIsEditing(true)
              }}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Header card */}
      <OpportunityHeader
        title={localOpp.title}
        contact={opp.contact}
        contactId={opp.contactId}
        onContactClick={() => opp.contactId && navigate(`/contacts/${opp.contactId}`)}
        amount={localOpp.amount}
        stage={localOpp.stage}
        daysInStage={daysInStage}
        dealProbability={localOpp.dealProbability}
        closeDate={localOpp.closeDate}
        daysToClose={daysToClose}
        projectStart={localOpp.projectStart}
        isEditing={isEditing}
        draft={draft}
        onDraftChange={changes => setDraft(d => ({ ...d, ...changes }))}
      />

      {/* Two-column layout — 60/40 */}
      <div className="flex gap-5">
        {/* Left: single card — 60% */}
        <div className="flex-[3] min-w-0 bg-surface-elevated rounded-card shadow-card overflow-hidden">
          {/* Tab buttons */}
          <TabsV tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="flex flex-col gap-4 pt-4">
              {/* Add task */}
              <div className="flex gap-[14px] items-start px-[16px]">
                <div className="flex-1 flex items-center rounded-card border border-border-primary-bold bg-transparent focus-within:border-border-primary-bold transition-colors h-[40px]">
                  <input
                    type="text"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask()}
                    placeholder="Add a task..."
                    className="flex-1 px-[12px] font-crm text-body-3 text-content bg-transparent focus:outline-none placeholder:text-content-disabled min-w-0"
                  />

                  {/* Date chip — appears inline when a date is selected */}
                  {newTaskDueDate && (
                    <div
                      className="flex items-center gap-1 rounded-md px-2 py-0.5 mx-1 shrink-0"
                      style={{ backgroundColor: '#E8F5F0' }}
                    >
                      <Calendar size={11} color="#2B6B52" />
                      <span className="text-xs font-medium whitespace-nowrap" style={{ color: '#2B6B52' }}>
                        {format(new Date(newTaskDueDate + 'T00:00:00'), 'MMM d')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setNewTaskDueDate('')}
                        className="ml-0.5 hover:opacity-60 transition-opacity"
                      >
                        <X size={10} color="#2B6B52" />
                      </button>
                    </div>
                  )}

                  {/* Calendar icon — opens picker */}
                  <div className="relative pr-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowDueDatePicker(p => !p)}
                      className="p-1.5 rounded transition-colors hover:bg-[#f4f4f4]"
                      title="Set due date"
                    >
                      <Calendar size={15} color={newTaskDueDate ? '#2B6B52' : '#c0c0c0'} />
                    </button>

                    {showDueDatePicker && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDueDatePicker(false)} />
                        <div
                          className="absolute right-0 top-full mt-1.5 z-20 bg-white rounded-lg border border-[#e5e5e5] shadow-lg p-3"
                          style={{ minWidth: 200 }}
                        >
                          <p className="text-xs font-medium text-[#838383] mb-2">Due date</p>
                          <input
                            type="date"
                            value={newTaskDueDate}
                            onChange={e => {
                              setNewTaskDueDate(e.target.value)
                              setShowDueDatePicker(false)
                            }}
                            className="w-full text-sm border border-[#dde1e6] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#2B6B52]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={addTask}
                  className="h-[40px] w-[67px] shrink-0 bg-brand-action rounded-xl px-[12px] py-[8px] font-crm text-body-3 font-bold text-content-invert"
                >
                  Add
                </button>
              </div>

              {/* Upcoming */}
              <UpcomingTasks
                tasks={localActivities}
                completedTaskIds={completedTaskIds}
                onComplete={completeTask}
                onAccept={(task) => setLocalActivities(prev => prev.map(t => t.id === task.id ? { ...t, isSuggested: false } : t))}
                onDismiss={(taskId) => setLocalActivities(prev => prev.filter(t => t.id !== taskId))}
                onSaveLater={(task) => saveTaskForLater({ ...task, account: opp.account, opportunityId: opp.id })}
                onCall={(task) => setPhoneModal({ isOpen: true, contact: task.contact, company: opp.account })}
                emptyMessage="No upcoming tasks."
              />

              {/* Activity log */}
              <ActivitiesContainer
                activities={opp.activities?.log ?? []}
                search={activitySearch}
                onSearchChange={setActivitySearch}
              />
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="p-[20px]">
              <DocumentsTable documents={opp.documents ?? []} />
            </div>
          )}

          {/* Estimates Tab */}
          {activeTab === 'estimates' && (() => {
            const contactEmail = allContacts.find(c => c.id === opp.contactId)?.email || ''
            const estimates = opp.estimates || []
            return (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-crm text-body-2 font-bold text-content">Estimates</h3>
                  <button
                    onClick={() => setShowCreateEstimate(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-card border border-border font-crm text-body-3 text-content-subtlest hover:bg-surface transition-colors"
                  >
                    <Plus size={13} />
                    Create new estimate
                  </button>
                </div>
                <EstimatesTable
                  estimates={estimates}
                  onSend={est => setEmailDraft({ estimate: est, mode: 'send', contactEmail })}
                  onFollowUp={est => setEmailDraft({ estimate: est, mode: 'followup', contactEmail })}
                />
              </div>
            )
          })()}

          {/* Emails Tab */}
          {activeTab === 'emails' && (() => {
            const emailLog = (opp.activities?.log || []).filter(e => e.type === 'email')
            return emailLog.length === 0 ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <Mail size={36} className="text-border mb-3" />
                <p className="font-crm text-body-3 text-content-disabled">No emails sent yet</p>
                <p className="font-crm text-body-3 text-content-disabled mt-1">Send an estimate from the Estimates tab to log emails here</p>
              </div>
            ) : (
              <div className="p-4 flex flex-col gap-3">
                {emailLog.map(entry => (
                  <div key={entry.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
                      <Mail size={12} className="text-content-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-crm text-body-3 text-content">{entry.description}</p>
                      {entry.bold && (
                        <p className="font-crm text-body-3 text-content-subtlest truncate">{entry.bold}</p>
                      )}
                      <p className="font-crm text-body-3 text-content-disabled mt-0.5">
                        {format(parseISO(entry.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>

        {/* Right: Always visible panels — 40% */}
        <div className="flex-[2] min-w-0 flex flex-col gap-4">
          {/* Bidding + Bidding History */}
          <BiddingSection bids={opp.bids ?? []} biddingHistory={opp.biddingHistory ?? []} />

          {/* Notes */}
          <div className="bg-surface-elevated rounded-card shadow-card p-4">
            <h3 className="font-crm text-body-2 font-bold text-content mb-3">Notes</h3>
            <NotesFeed
              notes={oppNotes}
              onAddNote={() => setShowCompose(true)}
              onTogglePin={togglePinNote}
            />
          </div>
        </div>
      </div>

      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={() => setPhoneModal({ isOpen: false })}
        contact={phoneModal.contact}
        company={phoneModal.company}
      />

      <CreateEstimateModal
        isOpen={showCreateEstimate}
        onClose={() => setShowCreateEstimate(false)}
        oppId={opp.id}
        oppTitle={opp.title}
        accountName={opp.account}
      />

      <EmailDraftModal
        isOpen={!!emailDraft}
        onClose={() => setEmailDraft(null)}
        oppId={opp.id}
        estimate={emailDraft?.estimate}
        mode={emailDraft?.mode}
        contactName={opp.contact}
        contactEmail={emailDraft?.contactEmail}
        oppTitle={opp.title}
      />

      <NoteComposePanel
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSave={noteData => addNote('opportunity', opp.id, noteData)}
        entityContext={{
          type: 'opportunity',
          bids: opp.bids ?? [],
          relatedOpps: [],
        }}
      />
    </div>
  )
}
