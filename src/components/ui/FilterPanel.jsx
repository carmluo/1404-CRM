import { useState } from 'react'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Tag from './Tag'

// Figma node 1480:42116
// Background: linear-gradient(145.67deg, #EAE7E4 4.85%, #F2F2F2 29.35%) — secondary/beige
// Header: h-[80px] p-[20px], SlidersHorizontal 24px + H6 bold
// Content: bg-surface-white rounded-tl-card rounded-tr-card px-[8px] py-[24px] gap-[16px]
// Filter group: px-[12px] gap-[8px], label body-2 text-content-subtle
// Input: h-[47px] px-[12px] py-[10px] rounded-[4px] border-border body-2

export default function FilterPanel({ isOpen, onClose, context = 'opportunities', onApply }) {
  const [localFilters, setLocalFilters] = useState({
    stages: [],
    statuses: [],
    owner: '',
    amountMin: '',
    amountMax: '',
    closeDateFrom: '',
    closeDateTo: '',
    types: [],
    engagements: [],
  })

  const stageOptions = ['Qualifying', 'Needs Analysis', 'Estimate Prep', 'Estimate Submitted', 'Negotiation', 'Verbal Commit']
  const statusOptions = ['overdue', 'no-activity', 'active']
  const typeOptions = ['Customer', 'Prospect']
  const engagementOptions = ['Responsive', 'Moderate', 'Weak']
  const ownerOptions = ['Marcus Reynolds', 'Sarah Kim']

  function toggleArrayFilter(key, value) {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }

  function clearAll() {
    setLocalFilters({
      stages: [],
      statuses: [],
      owner: '',
      amountMin: '',
      amountMax: '',
      closeDateFrom: '',
      closeDateTo: '',
      types: [],
      engagements: [],
    })
  }

  function getActiveCount() {
    let count = 0
    if (localFilters.stages.length) count++
    if (localFilters.statuses.length) count++
    if (localFilters.owner) count++
    if (localFilters.amountMin || localFilters.amountMax) count++
    if (localFilters.closeDateFrom || localFilters.closeDateTo) count++
    if (localFilters.types.length) count++
    if (localFilters.engagements.length) count++
    return count
  }

  function handleApply() {
    onApply && onApply(localFilters)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-[35vw] z-50 flex flex-col overflow-hidden shadow-[0px_2px_4px_0px_rgba(173,173,173,0.25),-2px_4px_12px_0px_rgba(203,203,203,0.5)]"
            style={{ background: 'linear-gradient(145.67deg, #EAE7E4 4.85%, #F2F2F2 29.35%)' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
          >
            {/* ── Header ── */}
            <div className="flex h-[80px] items-center justify-between p-5 shrink-0">
              <div className="flex items-center gap-3">
                <SlidersHorizontal size={24} className="text-content shrink-0" />
                <h2 className="font-crm text-h6 font-bold text-content leading-[28.6px] whitespace-nowrap">
                  Filters
                </h2>
                {getActiveCount() > 0 && (
                  <span className="w-5 h-5 rounded-full bg-brand-action flex items-center justify-center font-crm text-[12px] font-bold text-content-invert shrink-0">
                    {getActiveCount()}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-content-disabled hover:text-content-subtlest hover:bg-surface transition-colors shrink-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* ── Scrollable content ── */}
            <div className="bg-surface-white rounded-tl-card rounded-tr-card flex-1 flex flex-col gap-4 overflow-y-auto min-h-0 px-2 py-6">

              {/* Stage (opportunities) */}
              {context === 'opportunities' && (
                <FilterGroup label="Stage">
                  {stageOptions.map(s => (
                    <Tag
                      key={s}
                      label={s}
                      state={localFilters.stages.includes(s) ? 'selected' : 'unselected'}
                      onClick={() => toggleArrayFilter('stages', s)}
                    />
                  ))}
                </FilterGroup>
              )}

              {/* Status (opportunities) */}
              {context === 'opportunities' && (
                <FilterGroup label="Status">
                  {statusOptions.map(s => (
                    <Tag
                      key={s}
                      label={s === 'no-activity' ? 'No activity' : s === 'overdue' ? 'Overdue' : 'Active'}
                      state={localFilters.statuses.includes(s) ? 'selected' : 'unselected'}
                      onClick={() => toggleArrayFilter('statuses', s)}
                    />
                  ))}
                </FilterGroup>
              )}

              {/* Type (accounts) */}
              {context === 'accounts' && (
                <FilterGroup label="Type">
                  {typeOptions.map(t => (
                    <Tag
                      key={t}
                      label={t}
                      state={localFilters.types.includes(t) ? 'selected' : 'unselected'}
                      onClick={() => toggleArrayFilter('types', t)}
                    />
                  ))}
                </FilterGroup>
              )}

              {/* Engagement (contacts) */}
              {context === 'contacts' && (
                <FilterGroup label="Engagement">
                  {engagementOptions.map(e => (
                    <Tag
                      key={e}
                      label={e}
                      state={localFilters.engagements.includes(e) ? 'selected' : 'unselected'}
                      onClick={() => toggleArrayFilter('engagements', e)}
                    />
                  ))}
                </FilterGroup>
              )}

              {/* Account Owner */}
              <div className="flex flex-col gap-1 px-3 w-full">
                <p className="font-crm text-body-2 text-content leading-[27px]">Account Owner</p>
                <div className="relative w-full">
                  <select
                    value={localFilters.owner}
                    onChange={e => setLocalFilters(prev => ({ ...prev, owner: e.target.value }))}
                    className="w-full h-[47px] appearance-none bg-surface-white border border-border rounded-badge px-3 py-[10px] font-crm text-body-2 text-content focus:outline-none focus:border-border-primary"
                  >
                    <option value="">eg. Kitchen Remodel — Store #1842</option>
                    {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={20} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-content-disabled" />
                </div>
              </div>

              {/* Revenue / Amount range */}
              {(context === 'opportunities' || context === 'accounts') && (
                <div className="flex flex-col gap-1 px-3 w-full">
                  <p className="font-crm text-body-2 text-content leading-[27px]">
                    {context === 'opportunities' ? 'Amount Range' : 'Revenue Range'}
                  </p>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.amountMin}
                      onChange={e => setLocalFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                      className="flex-1 min-w-0 h-[47px] bg-surface-white border border-border rounded-badge px-3 py-[10px] font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.amountMax}
                      onChange={e => setLocalFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                      className="flex-1 min-w-0 h-[47px] bg-surface-white border border-border rounded-badge px-3 py-[10px] font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Close date range (opportunities) */}
              {context === 'opportunities' && (
                <div className="flex flex-col gap-1 px-3 w-full">
                  <p className="font-crm text-body-2 text-content leading-[27px]">Close date</p>
                  <div className="flex flex-col gap-1">
                    <input
                      type="date"
                      value={localFilters.closeDateFrom}
                      onChange={e => setLocalFilters(prev => ({ ...prev, closeDateFrom: e.target.value }))}
                      className="w-full h-[47px] bg-surface-white border border-border rounded-badge px-3 py-[10px] font-crm text-body-2 text-content focus:outline-none focus:border-border-primary"
                    />
                    <input
                      type="date"
                      value={localFilters.closeDateTo}
                      onChange={e => setLocalFilters(prev => ({ ...prev, closeDateTo: e.target.value }))}
                      className="w-full h-[47px] bg-surface-white border border-border rounded-badge px-3 py-[10px] font-crm text-body-2 text-content focus:outline-none focus:border-border-primary"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* ── Footer ── */}
            <div className="px-5 py-4 flex gap-3 shrink-0 bg-surface-white border-t border-border">
              <button
                onClick={clearAll}
                className="flex-1 h-[47px] rounded-card border border-border font-crm text-body-3 text-content-subtle hover:bg-surface transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={handleApply}
                className="flex-1 h-[47px] rounded-card bg-brand-action font-crm text-body-3 text-content-invert hover:opacity-90 transition-opacity"
              >
                Apply filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-2 px-3 w-full">
      <p className="font-crm text-body-2 text-content-subtle leading-[27px]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  )
}
