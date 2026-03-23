/**
 * OpportunityHeader — Figma node 1026:6123
 *
 * Card:    bg-surface-elevated border border-border rounded-card px-[8px] py-[12px]
 * Title:   text-h6 font-bold text-content (22px/29px)
 * Labels:  text-body-3 text-content-subtlest (14px)
 * Values:  text-body-2 text-content (18px)
 * Stats row gap: 42px
 * Probability bar: 7 pills h-[19px] rounded-[100px] gap-[2px]
 *   filled: bg-viz-dark, unfilled: bg-viz-subtlest
 * Warning tags: bg-warning rounded-badge px-[8px] py-[4px] text-body-3 text-warning-text
 */
import { format, parseISO } from 'date-fns'


const STAGES = ['Qualifying', 'Needs Analysis', 'Estimate Prep', 'Estimate Submitted', 'Negotiation', 'Verbal Commit']
const STAGE_PROBABILITY = {
  'Qualifying': 20,
  'Needs Analysis': 35,
  'Estimate Prep': 50,
  'Estimate Submitted': 60,
  'Negotiation': 75,
  'Verbal Commit': 90,
}
const PROB_PILLS = 7

function ProbabilityBar({ value }) {
  const filled = Math.round((value / 100) * PROB_PILLS)
  return (
    <div className="flex items-center w-[38px] h-[19px] gap-[2px]">
      {Array.from({ length: PROB_PILLS }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-full rounded-[100px] ${i < filled ? 'bg-viz-dark' : 'bg-viz-subtlest'}`}
        />
      ))}
    </div>
  )
}

function WarningTag({ children }) {
  return (
    <span className="bg-warning rounded-badge px-[8px] py-[4px] font-crm text-body-3 text-warning-bold whitespace-nowrap">
      {children}
    </span>
  )
}

function Divider() {
  return <div className="w-px h-[40px] bg-[#E5E5E5] mx-[21px] shrink-0" />
}

function StatCol({ label, children }) {
  return (
    <div className="flex flex-col gap-[4px] shrink-0">
      <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">{label}</p>
      <div className="flex items-center gap-[6px]">
        {children}
      </div>
    </div>
  )
}

export default function OpportunityHeader({
  title,
  contact,
  contactId,
  amount,
  stage,
  daysInStage,
  dealProbability,
  closeDate,
  daysToClose,
  projectStart,
  isEditing,
  draft,
  onDraftChange,
  onContactClick,
}) {
  function formatCurrency(val) {
    if (!val) return '$0'
    return `$${Number(val).toLocaleString()}`
  }

  return (
    <div className="bg-surface-elevated rounded-card px-[8px] py-[12px] flex flex-col gap-[14px]">
      {/* Title */}
      <div className="px-[8px]">
        {isEditing ? (
          <input
            value={draft.title}
            onChange={e => onDraftChange({ title: e.target.value })}
            className="font-crm text-h6 font-bold text-content border border-border-input rounded-card px-[8px] py-[4px] w-full focus:outline-none focus:border-border-primary"
          />
        ) : (
          <h1 className="font-crm text-h6 font-bold text-black">{title}</h1>
        )}
      </div>

      {/* Stats row */}
      <div className="px-[8px] flex flex-wrap items-center">

        {/* Contact */}
        <StatCol label="Contact">
          <button
            onClick={onContactClick}
            className="font-crm text-body-2 text-content-primary hover:underline whitespace-nowrap"
          >
            {contact || '—'}
          </button>
        </StatCol>

        <Divider />

        {/* Deal value */}
        <StatCol label="Deal value">
          {isEditing ? (
            <div className="flex items-center gap-[4px]">
              <span className="font-crm text-body-3 text-content-subtlest">$</span>
              <input
                type="number"
                value={draft.amount}
                onChange={e => onDraftChange({ amount: Number(e.target.value) })}
                className="border border-border-input rounded-card px-[8px] py-[4px] font-crm text-body-3 text-content focus:outline-none focus:border-border-primary w-[120px]"
              />
            </div>
          ) : (
            <p className="font-crm text-body-2 font-bold text-content">{formatCurrency(amount)}</p>
          )}
        </StatCol>

        <Divider />

        {/* Stage */}
        <StatCol label="Stage">
          {isEditing ? (
            <select
              value={draft.stage}
              onChange={e => {
                const s = e.target.value
                onDraftChange({ stage: s, dealProbability: STAGE_PROBABILITY[s] ?? draft.dealProbability })
              }}
              className="border border-border-input rounded-card px-[8px] py-[4px] font-crm text-body-3 text-content focus:outline-none focus:border-border-primary"
            >
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          ) : (
            <>
              <p className="font-crm text-body-2 text-content whitespace-nowrap">{stage}</p>
              {daysInStage >= 30 && (
                <WarningTag>at stage for {Math.floor(daysInStage / 30)} months</WarningTag>
              )}
            </>
          )}
        </StatCol>

        <Divider />

        {/* Deal probability — auto-derived from stage, never manually editable */}
        <StatCol label="Deal probability">
          <div className="flex items-center gap-[8px]">
            <ProbabilityBar value={isEditing ? (draft.dealProbability ?? dealProbability) : dealProbability} />
            <p className="font-crm text-body-2 font-bold text-content">
              {isEditing ? (draft.dealProbability ?? dealProbability) : dealProbability}%
            </p>
          </div>
        </StatCol>

        <Divider />

        {/* Close date */}
        <StatCol label="Close date">
          {isEditing ? (
            <input
              type="date"
              value={draft.closeDate || ''}
              onChange={e => onDraftChange({ closeDate: e.target.value })}
              className="border border-border-input rounded-card px-[8px] py-[4px] font-crm text-body-3 text-content focus:outline-none focus:border-border-primary"
            />
          ) : (
            <>
              <p className="font-crm text-body-2 text-content whitespace-nowrap">
                {closeDate ? format(parseISO(closeDate), 'MMM d, yyyy') : '—'}
              </p>
              {daysToClose !== null && daysToClose >= 0 && daysToClose <= 30 && (
                <WarningTag>{daysToClose} days away</WarningTag>
              )}
            </>
          )}
        </StatCol>

        <Divider />

        {/* Project start */}
        <StatCol label="Project start">
          {isEditing ? (
            <input
              type="date"
              value={draft.projectStart || ''}
              onChange={e => onDraftChange({ projectStart: e.target.value })}
              className="border border-border-input rounded-card px-[8px] py-[4px] font-crm text-body-3 text-content focus:outline-none focus:border-border-primary"
            />
          ) : (
            <p className="font-crm text-body-2 text-content whitespace-nowrap">
              {projectStart ? format(parseISO(projectStart), 'MMMM yyyy') : '—'}
            </p>
          )}
        </StatCol>

      </div>
    </div>
  )
}
