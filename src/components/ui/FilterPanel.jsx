import React, { useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-[#2B6B52]" />
                <h2 className="font-semibold text-[#21272a]">Filters</h2>
                {getActiveCount() > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#2B6B52' }}
                  >
                    {getActiveCount()}
                  </span>
                )}
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#838383]">
                <X size={16} />
              </button>
            </div>

            {/* Filters */}
            <div className="flex-1 overflow-y-auto py-4 px-5 flex flex-col gap-5">

              {/* Stage filter (opportunities) */}
              {context === 'opportunities' && (
                <div>
                  <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">Stage</p>
                  <div className="flex flex-wrap gap-2">
                    {stageOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleArrayFilter('stages', s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          localFilters.stages.includes(s)
                            ? 'bg-[#2B6B52] text-white border-[#2B6B52]'
                            : 'bg-white text-[#565656] border-[#e5e5e5] hover:border-[#2B6B52]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status filter (opportunities) */}
              {context === 'opportunities' && (
                <div>
                  <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleArrayFilter('statuses', s)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                          localFilters.statuses.includes(s)
                            ? 'bg-[#2B6B52] text-white border-[#2B6B52]'
                            : 'bg-white text-[#565656] border-[#e5e5e5] hover:border-[#2B6B52]'
                        }`}
                      >
                        {s === 'no-activity' ? 'No activity' : s === 'overdue' ? 'Overdue' : 'Active'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Type filter (accounts) */}
              {context === 'accounts' && (
                <div>
                  <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">Type</p>
                  <div className="flex gap-2">
                    {typeOptions.map(t => (
                      <button
                        key={t}
                        onClick={() => toggleArrayFilter('types', t)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          localFilters.types.includes(t)
                            ? 'bg-[#2B6B52] text-white border-[#2B6B52]'
                            : 'bg-white text-[#565656] border-[#e5e5e5] hover:border-[#2B6B52]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Engagement filter (contacts) */}
              {context === 'contacts' && (
                <div>
                  <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">Engagement</p>
                  <div className="flex gap-2">
                    {engagementOptions.map(e => (
                      <button
                        key={e}
                        onClick={() => toggleArrayFilter('engagements', e)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          localFilters.engagements.includes(e)
                            ? 'bg-[#2B6B52] text-white border-[#2B6B52]'
                            : 'bg-white text-[#565656] border-[#e5e5e5] hover:border-[#2B6B52]'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Owner */}
              <div>
                <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">Account Owner</p>
                <select
                  value={localFilters.owner}
                  onChange={e => setLocalFilters(prev => ({ ...prev, owner: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm text-[#21272a] focus:outline-none focus:border-[#2B6B52] bg-white"
                >
                  <option value="">All owners</option>
                  {ownerOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Amount range */}
              {(context === 'opportunities' || context === 'accounts') && (
                <div>
                  <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">
                    {context === 'opportunities' ? 'Amount range' : 'Revenue range'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.amountMin}
                      onChange={e => setLocalFilters(prev => ({ ...prev, amountMin: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.amountMax}
                      onChange={e => setLocalFilters(prev => ({ ...prev, amountMax: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
                    />
                  </div>
                </div>
              )}

              {/* Close date range (opportunities) */}
              {context === 'opportunities' && (
                <div>
                  <p className="text-xs font-semibold text-[#838383] uppercase tracking-wide mb-2">Close date</p>
                  <div className="flex flex-col gap-2">
                    <input
                      type="date"
                      value={localFilters.closeDateFrom}
                      onChange={e => setLocalFilters(prev => ({ ...prev, closeDateFrom: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
                    />
                    <input
                      type="date"
                      value={localFilters.closeDateTo}
                      onChange={e => setLocalFilters(prev => ({ ...prev, closeDateTo: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#e5e5e5] flex gap-3">
              <button
                onClick={clearAll}
                className="flex-1 py-2 rounded-lg border border-[#e5e5e5] text-sm text-[#565656] font-medium hover:bg-gray-50 transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-2 rounded-lg text-sm text-white font-medium transition-colors"
                style={{ backgroundColor: '#2B6B52' }}
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
