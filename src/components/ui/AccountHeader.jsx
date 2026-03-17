/**
 * AccountHeader — Figma node 1279:85580 (view) / 1091:68181 (edit)
 *
 * Card:        bg-surface-elevated rounded-card p-[16px]
 * View mode:   name (H6 bold) + social icons row, overview italic, flex-wrap stats grid
 * Edit mode:   name input, social link inputs (icon + input), overview textarea,
 *              stacked full-width fields (label + input), status w-[110px] with ChevronDown
 * Input style: border border-border rounded-[4px] px-[8px] py-[4px] font-crm text-body-2 text-content
 */
import { Link, Linkedin, Facebook, ChevronDown } from 'lucide-react'

const INPUT_CLS = 'border border-border rounded-[4px] px-[8px] py-[4px] font-crm text-body-2 text-content w-full focus:outline-none focus:border-border-primary bg-transparent'

function EditField({ label, children }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <p className="font-crm text-body-3 text-content-subtlest">{label}</p>
      {children}
    </div>
  )
}

function StatCol({ label, children }) {
  return (
    <div className="flex flex-col items-start shrink-0">
      <p className="font-crm text-body-3 text-content-subtlest">{label}</p>
      <div className="font-crm text-body-2 text-content">
        {children}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const isActive = status?.toLowerCase() === 'active'
  return (
    <span className={`inline-flex items-center px-[8px] py-[2px] rounded-badge font-crm text-body-2 whitespace-nowrap ${
      isActive ? 'bg-safe text-safe-bold' : 'bg-surface text-content-disabled'
    }`}>
      {status || '—'}
    </span>
  )
}

const ACCOUNT_TYPES = ['Customer', 'Prospect']
const ACCOUNT_STATUSES = ['Active', 'Inactive']

export default function AccountHeader({
  name,
  overview,
  address,
  annualRevenue,
  status,
  type,
  industry,
  website,
  linkedin,
  facebook,
  isEditing,
  draft,
  onDraftChange,
}) {
  function formatRevenue(val) {
    if (!val && val !== 0) return '—'
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
    return `$${val}`
  }

  return (
    <div className="bg-surface-elevated rounded-card p-[16px] flex flex-col gap-[14px]">

      {/* Name row */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={draft.name}
              onChange={e => onDraftChange({ name: e.target.value })}
              className="font-crm text-h6 font-bold text-content border border-border rounded-[4px] px-[8px] py-[4px] w-full focus:outline-none focus:border-border-primary bg-transparent"
            />
          ) : (
            <h1 className="font-crm text-h6 font-bold text-content whitespace-nowrap">{name}</h1>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-[12px] shrink-0 ml-[12px]">
            <button
              onClick={() => website && window.open(website, '_blank')}
              className="text-content-disabled hover:text-content-subtle transition-colors"
              title="Website"
            >
              <Link size={24} />
            </button>
            <button
              onClick={() => linkedin && window.open(linkedin, '_blank')}
              className="text-content-disabled hover:text-content-subtle transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </button>
            <button
              onClick={() => facebook && window.open(facebook, '_blank')}
              className="text-content-disabled hover:text-content-subtle transition-colors"
              title="Facebook"
            >
              <Facebook size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Social link inputs — edit mode only */}
      {isEditing && (
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <Link size={24} className="shrink-0 text-content-disabled" />
            <input
              value={draft.website ?? ''}
              onChange={e => onDraftChange({ website: e.target.value })}
              placeholder="https://..."
              className={INPUT_CLS}
            />
          </div>
          <div className="flex items-center gap-[12px]">
            <Linkedin size={24} className="shrink-0 text-content-disabled" />
            <input
              value={draft.linkedin ?? ''}
              onChange={e => onDraftChange({ linkedin: e.target.value })}
              placeholder="LinkedIn URL"
              className={INPUT_CLS}
            />
          </div>
          <div className="flex items-center gap-[12px]">
            <Facebook size={24} className="shrink-0 text-content-disabled" />
            <input
              value={draft.facebook ?? ''}
              onChange={e => onDraftChange({ facebook: e.target.value })}
              placeholder="Facebook URL"
              className={INPUT_CLS}
            />
          </div>
        </div>
      )}

      {/* Overview / description */}
      {isEditing ? (
        <textarea
          value={draft.overview}
          onChange={e => onDraftChange({ overview: e.target.value })}
          rows={3}
          className="border border-border rounded-[4px] px-[8px] py-[4px] font-crm text-body-3 text-content w-full focus:outline-none focus:border-border-primary resize-none bg-transparent"
        />
      ) : (
        overview && (
          <p className="font-crm text-body-3 italic text-content-subtle leading-[21px]">{overview}</p>
        )
      )}

      {/* Stats — flex-wrap grid in view, stacked fields in edit */}
      {isEditing ? (
        <div className="flex flex-col gap-[16px]">
          <EditField label="Address">
            <input
              value={draft.address}
              onChange={e => onDraftChange({ address: e.target.value })}
              placeholder="Address"
              className={INPUT_CLS}
            />
          </EditField>

          <EditField label="Annual revenue">
            <input
              type="number"
              value={draft.annualRevenue}
              onChange={e => onDraftChange({ annualRevenue: Number(e.target.value) })}
              className={INPUT_CLS}
            />
          </EditField>

          <EditField label="Status">
            <div className="relative w-[110px]">
              <select
                value={draft.status}
                onChange={e => onDraftChange({ status: e.target.value })}
                className="appearance-none border border-border rounded-[4px] px-[8px] py-[4px] pr-7 font-crm text-body-2 text-content w-full focus:outline-none focus:border-border-primary bg-transparent cursor-pointer"
              >
                {ACCOUNT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={16} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-content-subtlest" strokeWidth={1.75} />
            </div>
          </EditField>

          <EditField label="Type">
            <select
              value={draft.type}
              onChange={e => onDraftChange({ type: e.target.value })}
              className="appearance-none border border-border rounded-[4px] px-[8px] py-[4px] font-crm text-body-2 text-content w-full focus:outline-none focus:border-border-primary bg-transparent cursor-pointer"
            >
              {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </EditField>

          <EditField label="Industry">
            <input
              value={draft.industry}
              onChange={e => onDraftChange({ industry: e.target.value })}
              placeholder="Industry"
              className={INPUT_CLS}
            />
          </EditField>
        </div>
      ) : (
        <div className="flex flex-wrap gap-x-[24px] gap-y-[16px]">
          <StatCol label="Address">
            <span className="whitespace-pre-line">{address || '—'}</span>
          </StatCol>
          <StatCol label="Annual revenue">
            <span>{formatRevenue(annualRevenue)}</span>
          </StatCol>
          <StatCol label="Status">
            <StatusBadge status={status} />
          </StatCol>
          <StatCol label="Type">
            <span>{type || '—'}</span>
          </StatCol>
          <StatCol label="Industry">
            <span>{industry || '—'}</span>
          </StatCol>
        </div>
      )}

    </div>
  )
}
