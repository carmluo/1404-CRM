import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X, LogIn, SquareLibrary, User, ListChecks, ClipboardList, ArrowUpRight, Activity,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import Badge from './Badge'
import Accordion from './Accordion'
import IconActivityType from './IconActivityType'

function formatCurrency(val) {
  if (!val && val !== 0) return '—'
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  return `$${val}`
}

export default function AccountDrawer({ account, onClose, onViewDetail }) {
  const navigate = useNavigate()

  if (!account) return null

  const contacts = account.contacts || []
  const suggestedTasks = account.activities?.upcoming?.filter(t => t.isSuggested) || []
  const activityLog = (account.activities?.log || []).slice(0, 5)

  function handleViewDetail() {
    if (onViewDetail) {
      onViewDetail(account)
    } else {
      navigate(`/accounts/${account.id}`)
      onClose()
    }
  }

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
        transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-4 px-[9px] py-[14px] h-full min-h-0">

          {/* ── Header ── */}
          <div className="flex items-center justify-between pl-3 shrink-0">
            <div className="flex items-center gap-2.5 flex-1 min-w-0 mr-2">
              <div className="w-9 h-9 rounded-full bg-brand-action flex items-center justify-center shrink-0">
                <span className="font-crm text-body-3 font-bold text-content-invert">
                  {account.name.charAt(0)}
                </span>
              </div>
              <h2 className="font-crm text-h6 font-bold text-content leading-[28.6px] truncate min-w-0">
                {account.name}
              </h2>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleViewDetail}
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

            {/* About */}
            <Accordion
              label="About"
              icon={<SquareLibrary size={24} className="text-content-subtle shrink-0" />}
              defaultOpen={true}
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-[7px] px-3">
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Type</p>
                  <p className="font-crm text-body-2 text-content leading-[27px]">{account.type || '—'}</p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Status</p>
                  <div className="mt-0.5">
                    {account.status
                      ? <Badge variant="status" value={account.status.toLowerCase()} label={account.status} />
                      : <p className="font-crm text-body-2 text-content leading-[27px]">—</p>
                    }
                  </div>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Industry</p>
                  <p className="font-crm text-body-2 text-content leading-[27px] whitespace-normal">
                    {account.industry || '—'}
                  </p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Annual revenue</p>
                  <p className="font-crm text-body-2 font-bold text-content leading-[27px]">
                    {formatCurrency(account.annualRevenue)}
                  </p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Account owner</p>
                  <p className="font-crm text-body-2 text-content leading-[27px] whitespace-normal">
                    {account.accountOwner || '—'}
                  </p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Last activity</p>
                  <p className="font-crm text-body-2 text-content leading-[27px]">
                    {account.lastActivity
                      ? format(parseISO(account.lastActivity), 'MMM d, yyyy')
                      : '—'}
                  </p>
                </div>
                {account.address && (
                  <div className="col-span-2">
                    <p className="font-crm text-body-3 text-content leading-[21px]">Address</p>
                    <p className="font-crm text-body-2 text-content leading-[27px] whitespace-normal">
                      {account.address}
                    </p>
                  </div>
                )}
              </div>
            </Accordion>

            {/* Contacts */}
            <Accordion
              label="Contacts"
              icon={<User size={24} className="text-content-subtle shrink-0" />}
              defaultOpen={true}
            >
              {contacts.length === 0 ? (
                <p className="font-crm text-body-3 text-content-disabled px-3">No contacts linked.</p>
              ) : (
                <div className="w-full border border-border rounded-[8px] overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                    <p className="font-crm text-[12px] font-medium text-content-disabled flex-[1_0_0] min-w-0">NAME</p>
                    <p className="font-crm text-[12px] font-medium text-content-disabled w-[100px] shrink-0">LAST CONTACTED</p>
                    <p className="font-crm text-[12px] font-medium text-content-disabled w-[76px] shrink-0">ACTION</p>
                  </div>
                  {/* Contact rows */}
                  {contacts.map((c, i) => (
                    <div
                      key={c.id || c.name}
                      className={`flex items-center justify-between px-4 py-2 ${i < contacts.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="flex flex-col flex-[1_0_0] min-w-0 pr-2">
                        <p className="font-crm text-body-3 font-bold text-content-subtle leading-[21px] truncate">{c.name}</p>
                        {c.title && (
                          <p className="font-crm text-body-3 italic text-content-subtlest leading-[21px] truncate">{c.title}</p>
                        )}
                      </div>
                      <p className="font-crm text-body-3 text-content-subtlest leading-[21px] w-[100px] shrink-0">
                        {c.lastContacted ? format(parseISO(c.lastContacted), 'MMM d, yyyy') : '—'}
                      </p>
                      <div className="flex items-center gap-[4px] shrink-0 w-[76px]">
                        <IconActivityType type="mail" onClick={() => c.email && (window.location.href = `mailto:${c.email}`)} />
                        <IconActivityType type="call" onClick={() => c.phone && (window.location.href = `tel:${c.phone}`)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                        <div className="flex flex-col items-center self-stretch shrink-0">
                          <div className="bg-brand rounded-[4px] p-1 w-5 h-5 flex items-center justify-center shrink-0">
                            <Activity size={10} className="text-content-primary" />
                          </div>
                          {!isLast && <div className="w-px bg-border flex-1 mt-1" />}
                        </div>
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
