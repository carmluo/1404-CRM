// Figma node 1514:54338 — note compose panel
// Card: bg-surface-white flex flex-col gap-[16px] pt-[24px] pb-[16px] rounded-card shadow-panel
// Header: flex gap-[10px] items-center px-[24px] — H6 bold + lucide/x size-24
// Divider: border-t border-border
// Toggle: bg-brand rounded-card gap-[4px] px-[24px]
//   Active switch: bg-surface-white flex-1 h-[33px] px-[10px] py-[6px] rounded-badge shadow-inner
//   Inactive switch: flex-1 h-[33px] px-[10px] py-[6px] (no bg)
// Note box: px-[24px], textarea h-[252px] border-border rounded-badge px-[12px] py-[10px] B2
// Divider: border-t border-border
// Footer: flex gap-[16px] px-[24px]
//   Pin: bg-surface-white border-border flex-1 h-[46px] px-[12px] py-[8px] rounded-[12px] B3 text-content-subtle
//   Save: bg-brand-action flex-1 h-[46px] px-[12px] py-[8px] rounded-[12px] B3 text-content-invert

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pin } from 'lucide-react'

export default function NoteComposePanel({ isOpen, onClose, onSave, entityContext }) {
  const [noteType, setNoteType] = useState('internal')
  const [pinned, setPinned] = useState(false)
  const [body, setBody] = useState('')
  const [linkedAccountId, setLinkedAccountId] = useState('')
  const [linkedOppId, setLinkedOppId] = useState('')

  function handleSave() {
    if (!body.trim()) return
    onSave({
      type: noteType,
      body: body.trim(),
      pinned,
      linkedOppId: linkedOppId || null,
      linkedAccountId: linkedAccountId || null,
    })
    setNoteType('internal')
    setPinned(false)
    setBody('')
    setLinkedAccountId('')
    setLinkedOppId('')
    onClose()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') onClose()
  }

  const bids = entityContext?.bids ?? []
  const relatedOpps = entityContext?.relatedOpps ?? []
  const isOpp = entityContext?.type === 'opportunity'

  const TABS = [
    { value: 'internal', label: 'Internal' },
    { value: 'call_meeting', label: 'Call / Meeting' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-5 bottom-5 z-[60] w-[420px] bg-surface-white rounded-card shadow-[0px_2px_4px_0px_rgba(173,173,173,0.25),-2px_4px_12px_0px_rgba(203,203,203,0.5)] flex flex-col gap-[16px] pt-[24px] pb-[16px] overflow-hidden"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center gap-[10px] px-[24px]">
            <span className="flex-1 font-crm text-h6 font-bold text-content">New note</span>
            <button
              onClick={onClose}
              className="shrink-0 text-content-disabled hover:text-content transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-border" />

          {/* Type toggle */}
          <div className="px-[24px]">
            <div className="flex gap-[4px] bg-brand rounded-card p-[4px] w-full">
              {TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setNoteType(value)}
                  className={`flex-1 h-[33px] flex items-center justify-center px-[10px] py-[6px] rounded-badge font-crm text-body-3 text-content-subtlest whitespace-nowrap transition-all ${
                    noteType === value
                      ? 'bg-surface-white shadow-[-1px_2px_2px_0px_rgba(0,0,0,0.03)]'
                      : ''
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="px-[24px]">
            <textarea
              autoFocus
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your note..."
              className="h-[252px] w-full px-[12px] py-[10px] bg-surface-white border border-border rounded-badge font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary resize-none transition-colors"
            />
          </div>

          {/* Entity selectors (bid / opp linker) — functional extras not in Figma */}
          {((isOpp && bids.length > 0) || (!isOpp && relatedOpps.length > 0)) && (
            <div className="px-[24px] -mt-4">
              {isOpp && bids.length > 0 && (
                <select
                  value={linkedAccountId}
                  onChange={e => setLinkedAccountId(e.target.value)}
                  className="w-full font-crm text-body-3 text-content border border-border rounded-badge px-[12px] py-[8px] bg-surface-white focus:outline-none focus:border-border-primary"
                >
                  <option value="">Link to bidder…</option>
                  {bids.map(bid => (
                    <option key={bid.company} value={bid.company}>{bid.company}</option>
                  ))}
                </select>
              )}
              {!isOpp && relatedOpps.length > 0 && (
                <select
                  value={linkedOppId}
                  onChange={e => setLinkedOppId(e.target.value)}
                  className="w-full font-crm text-body-3 text-content border border-border rounded-badge px-[12px] py-[8px] bg-surface-white focus:outline-none focus:border-border-primary"
                >
                  <option value="">Link to opportunity…</option>
                  {relatedOpps.map(o => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="w-full border-t border-border" />

          {/* Footer: Pin + Save */}
          <div className="flex items-center gap-[16px] px-[24px]">
            <button
              type="button"
              onClick={() => setPinned(p => !p)}
              className={`flex-1 h-[46px] flex items-center justify-center gap-2 px-[12px] py-[8px] rounded-[12px] border font-crm text-body-3 transition-colors ${
                pinned
                  ? 'bg-brand border-brand-hover text-content-primary'
                  : 'bg-surface-white border-border text-content-subtle hover:bg-surface'
              }`}
            >
              <Pin size={14} fill={pinned ? 'currentColor' : 'none'} />
              {pinned ? 'Pinned' : 'Pin'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!body.trim()}
              className={`flex-1 h-[46px] flex items-center justify-center px-[12px] py-[8px] rounded-[12px] font-crm text-body-3 text-content-invert transition-colors ${
                body.trim()
                  ? 'bg-brand-action hover:bg-brand-action-hover'
                  : 'bg-brand-hover cursor-not-allowed'
              }`}
            >
              Save note
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
