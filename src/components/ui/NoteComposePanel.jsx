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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-5 bottom-5 z-[60] w-[420px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-crm text-body-2 font-bold text-content">New Note</span>
            <button
              onClick={onClose}
              className="p-1 rounded-card text-content-disabled hover:text-content transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Type toggle */}
          <div className="px-4 pt-3">
            <div className="flex rounded-card border border-border overflow-hidden">
              {[
                { value: 'internal', label: 'Internal' },
                { value: 'call_meeting', label: 'Call / Meeting' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setNoteType(value)}
                  className={`flex-1 px-3 py-1.5 font-crm text-body-3 transition-colors ${
                    noteType === value
                      ? 'bg-brand-action text-content-invert font-bold'
                      : 'bg-transparent text-content-subtlest hover:text-content'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="px-4 pt-3 pb-2 flex-1">
            <textarea
              autoFocus
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write your note…"
              rows={6}
              className="w-full px-3 py-2 rounded-card border border-border font-crm text-body-3 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary resize-none transition-colors"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 px-4 pb-4 pt-1 flex-wrap">
            {/* Pin toggle */}
            <button
              onClick={() => setPinned(p => !p)}
              className={`flex items-center gap-1.5 font-crm text-body-3 transition-colors ${
                pinned ? 'text-content-primary' : 'text-content-disabled hover:text-content'
              }`}
            >
              <Pin size={13} fill={pinned ? 'currentColor' : 'none'} />
              {pinned ? 'Pinned' : 'Pin'}
            </button>

            {/* Entity selector */}
            {isOpp && bids.length > 0 && (
              <select
                value={linkedAccountId}
                onChange={e => setLinkedAccountId(e.target.value)}
                className="font-crm text-body-3 text-content border border-border rounded-card px-2 py-1 bg-white focus:outline-none focus:border-border-primary"
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
                className="font-crm text-body-3 text-content border border-border rounded-card px-2 py-1 bg-white focus:outline-none focus:border-border-primary"
              >
                <option value="">Link to opportunity…</option>
                {relatedOpps.map(o => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={!body.trim()}
              className="px-4 py-1.5 rounded-card bg-brand-action font-crm text-body-3 font-bold text-content-invert hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Save note
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
