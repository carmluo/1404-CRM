import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X, LogIn, ClipboardList, SquareLibrary,
  ListChecks, ArrowUpRight, Activity,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Badge from './Badge'
import Accordion from './Accordion'

export default function ContactDrawer({ contact, onClose }) {
  const navigate = useNavigate()

  if (!contact) return null

  const suggestedTasks = contact.activities?.upcoming?.filter(t => t.isSuggested) || []
  const activityLog = (contact.activities?.log || []).slice(0, 5)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/20 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        className="fixed right-0 inset-y-0 w-[35vw] bg-surface-white border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex flex-col gap-4 px-[9px] py-[14px] h-full min-h-0">

          {/* ── Header ── */}
          <div className="flex items-center justify-between pl-3 shrink-0">
            <div className="flex flex-col gap-1 flex-1 min-w-0 mr-2">
              <h2 className="font-crm text-h6 font-bold text-content leading-[28.6px] truncate">
                {contact.name}
              </h2>
              {(contact.title || contact.account) && (
                <p className="font-crm text-body-2 text-content leading-[27px] truncate">
                  <span className="italic">{contact.title}{contact.title && contact.account ? ' at ' : ''}</span>
                  {contact.account && (
                    <span className="font-bold italic underline">{contact.account}</span>
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => { navigate(`/contacts/${contact.id}`); onClose() }}
                className="flex gap-2 items-center pl-[10px] pr-3 py-2 rounded-[12px] hover:bg-surface transition-colors"
              >
                <LogIn size={24} className="text-content-primary" />
                <span className="font-crm text-body-3 font-bold text-content-primary whitespace-nowrap">
                  View details
                </span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-[12px] text-content-disabled hover:text-content-subtlest hover:bg-surface transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">

            {/* Suggested focus */}
            {suggestedTasks.length > 0 && (
              <Accordion
                label="Suggested focus"
                icon={<ClipboardList size={24} className="text-content-subtle shrink-0" />}
                showAiTag={true}
                defaultOpen={true}
              >
                <div className="border border-border rounded-[8px] w-full">
                  {suggestedTasks.map((task, i) => (
                    <div
                      key={task.id}
                      className={`flex gap-3 items-center px-4 py-2 ${i < suggestedTasks.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <p className="font-crm text-body-2 text-content flex-1 min-w-0 leading-[27px]">
                        {task.task}
                      </p>
                      {task.contact && (
                        <div className="w-[101px] shrink-0">
                          <p className="font-crm text-body-3 font-bold text-content-subtle leading-[21px] truncate">
                            {task.contact}
                          </p>
                          {task.subtitle && (
                            <p className="font-crm text-body-3 italic text-content-subtlest leading-[21px] truncate">
                              {task.subtitle}
                            </p>
                          )}
                        </div>
                      )}
                      <div
                        className="w-[33px] h-[33px] rounded-[8px] flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: '#ece0f3', borderColor: '#d6aded' }}
                      >
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {/* Information */}
            <Accordion
              label="Information"
              icon={<SquareLibrary size={24} className="text-content-subtle shrink-0" />}
              defaultOpen={true}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-[7px] px-3">
                {contact.email && (
                  <div>
                    <p className="font-crm text-body-3 text-content leading-[21px]">Email</p>
                    <p className="font-crm text-body-2 text-content leading-[27px] break-all">{contact.email}</p>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <p className="font-crm text-body-3 text-content leading-[21px]">Mobile</p>
                    <p className="font-crm text-body-2 text-content leading-[27px]">{contact.phone}</p>
                  </div>
                )}
                {contact.engagement && (
                  <div>
                    <p className="font-crm text-body-3 text-content leading-[21px]">Engagement</p>
                    <div className="mt-1">
                      <Badge variant="engagement" value={contact.engagement} />
                    </div>
                  </div>
                )}
                {contact.lastContacted && (
                  <div>
                    <p className="font-crm text-body-3 text-content leading-[21px]">Last contacted</p>
                    <p className="font-crm text-body-2 text-content leading-[27px]">
                      {format(parseISO(contact.lastContacted), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
                {contact.accountOwner && (
                  <div>
                    <p className="font-crm text-body-3 text-content leading-[21px]">Account owner</p>
                    <p className="font-crm text-body-2 text-content leading-[27px]">{contact.accountOwner}</p>
                  </div>
                )}
              </div>
            </Accordion>

            {/* Recent activities */}
            <Accordion
              label="Recent activities"
              icon={<ListChecks size={24} className="text-content-subtle shrink-0" />}
              defaultOpen={false}
            >
              <div className="flex flex-col px-3">
                {activityLog.length === 0 ? (
                  <p className="font-crm text-body-3 text-content-disabled">No activity recorded yet.</p>
                ) : (
                  activityLog.map((entry, i) => {
                    const isLast = i === activityLog.length - 1
                    return (
                      <div key={entry.id} className="flex gap-3 items-start">
                        {/* Icon + vertical connector */}
                        <div className="flex flex-col items-center self-stretch shrink-0">
                          <div className="bg-brand rounded-[4px] p-1 w-5 h-5 flex items-center justify-center shrink-0">
                            <Activity size={10} className="text-content-primary" />
                          </div>
                          {!isLast && <div className="w-px bg-border flex-1 mt-1" />}
                        </div>
                        {/* Content */}
                        <div className={`flex flex-1 min-w-0 items-center gap-3 ${!isLast ? 'pb-4' : ''}`}>
                          <p className="font-crm text-body-3 text-content flex-1 min-w-0 leading-[21px]">
                            {entry.description}
                          </p>
                          <p className="text-[12px] font-medium text-content-disabled whitespace-nowrap shrink-0 leading-[1]">
                            {format(parseISO(entry.date), 'MMM d')}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Accordion>

          </div>
        </div>
      </motion.div>
    </>
  )
}
