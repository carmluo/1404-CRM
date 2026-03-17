import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X, LogIn, ClipboardList, SquareLibrary,
  Building2, ListChecks, ArrowUpRight, Activity,
} from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import Badge from './Badge'
import Accordion from './Accordion'

function formatCurrency(val) {
  if (!val && val !== 0) return '—'
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val}`
}

// 7-segment bar — filled count proportional to 0-100 value
function ProbabilityBar({ value = 0 }) {
  const TOTAL = 7
  const filled = Math.round((value / 100) * TOTAL)
  return (
    <div className="flex gap-[2px] w-[38px] h-[19px] items-center shrink-0">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-[100px] ${i < filled ? 'bg-viz-dark' : 'bg-viz-subtlest'}`}
        />
      ))}
    </div>
  )
}

export default function OpportunityDrawer({ opp, onClose }) {
  const navigate = useNavigate()

  if (!opp) return null

  const today = new Date()
  const closeDate = opp.closeDate ? parseISO(opp.closeDate) : null
  const daysToClose = closeDate ? differenceInDays(closeDate, today) : null
  const urgentTasks = opp.activities?.upcoming?.filter(t => t.isSuggested) || []
  const activityLog = (opp.activities?.log || []).slice(0, 5)

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
        className="fixed right-0 bottom-0 w-96 bg-surface-white border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden"
        style={{ top: 64 }}
        initial={{ x: 384 }}
        animate={{ x: 0 }}
        exit={{ x: 384 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="flex flex-col gap-4 px-[9px] py-[14px] h-full min-h-0">

          {/* ── Header ── */}
          <div className="flex items-center justify-between pl-3 shrink-0">
            <h2 className="font-crm text-h6 font-bold text-content leading-[28.6px] truncate flex-1 min-w-0 mr-2">
              {opp.title}
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => { navigate(`/opportunities/${opp.id}`); onClose() }}
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
            {urgentTasks.length > 0 && (
              <Accordion
                label="Suggested focus"
                icon={<ClipboardList size={24} className="text-content-subtle shrink-0" />}
                showAiTag={true}
                defaultOpen={true}
              >
                <div className="border border-border rounded-[8px] w-full">
                  {urgentTasks.map((task, i) => (
                    <div
                      key={task.id}
                      className={`flex gap-3 items-center px-4 py-2 ${i < urgentTasks.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <p className="font-crm text-body-2 text-content flex-1 min-w-0 leading-[27px]">
                        {task.task}
                      </p>
                      {task.contact && (
                        <div className="w-[101px] shrink-0">
                          <p className="font-crm text-body-3 font-bold text-content-subtle leading-[21px] truncate">
                            {task.contact}
                          </p>
                          {opp.account && (
                            <p className="font-crm text-body-3 italic text-content-subtlest leading-[21px] truncate">
                              {opp.account}
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
                  <p className="font-crm text-body-3 text-content leading-[21px]">Contact</p>
                  <p className="font-crm text-body-2 text-content leading-[27px]">{opp.contact || '—'}</p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Deal value</p>
                  <p className="font-crm text-body-2 text-content leading-[27px]">{formatCurrency(opp.amount)}</p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Stage</p>
                  <p className="font-crm text-body-2 text-content leading-[27px]">{opp.stage || '—'}</p>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Deal probability</p>
                  <div className="flex items-center gap-2 mt-1">
                    <ProbabilityBar value={opp.dealProbability || 0} />
                    <span className="font-crm text-body-2 text-content leading-[27px] whitespace-nowrap">
                      {opp.dealProbability ?? 0}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Close date</p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="font-crm text-body-2 text-content leading-[27px]">
                      {opp.closeDate ? format(parseISO(opp.closeDate), 'MMM d, yyyy') : '—'}
                    </span>
                    {daysToClose !== null && daysToClose >= 0 && daysToClose <= 30 && (
                      <span className="bg-warning px-2 py-1 rounded-[4px] font-crm text-body-3 text-warning-bold whitespace-nowrap">
                        {daysToClose}d away
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-crm text-body-3 text-content leading-[21px]">Project start</p>
                  <p className="font-crm text-body-2 text-content leading-[27px]">
                    {opp.projectStart ? format(parseISO(opp.projectStart), 'MMM d, yyyy') : '—'}
                  </p>
                </div>
              </div>
            </Accordion>

            {/* Accounts (bids) */}
            {opp.bids?.length > 0 && (
              <Accordion
                label="Accounts"
                icon={<Building2 size={24} className="text-content-subtle shrink-0" />}
                defaultOpen={true}
              >
                <div className="overflow-x-auto px-3">
                  <div
                    className="grid gap-x-4 gap-y-[7px] min-w-0"
                    style={{ gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr) auto' }}
                  >
                    {/* Header row */}
                    <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Company</p>
                    <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Contact</p>
                    <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Current bid</p>
                    <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Status</p>

                    {/* Data rows */}
                    {opp.bids.map((bid, i) => (
                      <>
                        <p key={`co-${i}`} className="font-crm text-body-3 text-content truncate">{bid.company}</p>
                        <p key={`cn-${i}`} className="font-crm text-body-3 text-content">{bid.contactName || '—'}</p>
                        <p key={`cb-${i}`} className="font-crm text-body-3 text-content">{formatCurrency(bid.currentBid)}</p>
                        <div key={`st-${i}`} className="flex items-center">
                          <Badge variant="status" value={(bid.status || '').toLowerCase()} label={bid.status} />
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </Accordion>
            )}

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
