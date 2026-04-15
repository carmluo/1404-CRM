import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Paperclip, Mail } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function formatCurrency(val) {
  if (!val && val !== 0) return '$0'
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`
  return `$${val}`
}

function buildBody(mode, contactName, oppTitle, estimate) {
  const firstName = contactName?.split(' ')[0] || 'there'
  const amount = formatCurrency(estimate?.amount)
  const name = estimate?.name || 'estimate'

  if (mode === 'send') {
    return `Hi ${firstName},\n\nPlease find attached our estimate for ${oppTitle || 'your project'}.\n\nEstimate: ${name}\nTotal: ${amount}\n\nDon't hesitate to reach out if you have any questions or would like to walk through the details together.\n\nBest regards`
  }
  return `Hi ${firstName},\n\nI'm following up on the estimate we sent for ${oppTitle || 'your project'} (${name}, ${amount}).\n\nHave you had a chance to review it? I'd be happy to schedule a call to discuss any questions or next steps.\n\nBest regards`
}

export default function EmailDraftModal({
  isOpen,
  onClose,
  oppId,
  estimate,       // { id?, name, amount, date, status }
  mode = 'send',  // 'send' | 'followup'
  contactName,
  contactEmail,
  oppTitle,
}) {
  const { sendEstimateEmail, showToast } = useApp()

  const [form, setForm] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
  })

  // Re-populate whenever the modal opens or its context changes
  useEffect(() => {
    if (!isOpen) return
    setForm({
      to: contactEmail || '',
      cc: '',
      subject: mode === 'send'
        ? `Estimate: ${estimate?.name || ''} — ${oppTitle || ''}`
        : `Following up: ${estimate?.name || ''} — ${oppTitle || ''}`,
      body: buildBody(mode, contactName, oppTitle, estimate),
    })
  }, [isOpen, mode, estimate, contactName, contactEmail, oppTitle])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSend() {
    if (!form.to.trim()) return
    sendEstimateEmail(oppId, estimate?.id || estimate?.name, {
      estimateName: estimate?.name,
      to: form.to,
      cc: form.cc,
      subject: form.subject,
    })
    showToast('Sent')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-5 bottom-5 z-[60] w-[480px] bg-surface-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-content-primary" />
              <h2 className="font-crm text-body-2 font-bold text-content">Email</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-card hover:bg-surface text-content-disabled transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Fields */}
          <div className="px-6 py-5 flex flex-col gap-3 overflow-y-auto max-h-[70vh]">

            {/* To */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <span className="font-crm text-body-3 text-content-disabled w-12 shrink-0">To</span>
              <input
                type="email"
                value={form.to}
                onChange={e => set('to', e.target.value)}
                placeholder="recipient@company.com"
                className="flex-1 font-crm text-body-3 text-content bg-transparent focus:outline-none placeholder:text-content-disabled"
              />
            </div>

            {/* CC */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <span className="font-crm text-body-3 text-content-disabled w-12 shrink-0">CC</span>
              <input
                type="text"
                value={form.cc}
                onChange={e => set('cc', e.target.value)}
                placeholder="Optional"
                className="flex-1 font-crm text-body-3 text-content bg-transparent focus:outline-none placeholder:text-content-disabled"
              />
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <span className="font-crm text-body-3 text-content-disabled w-12 shrink-0">Subject</span>
              <input
                type="text"
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                className="flex-1 font-crm text-body-3 text-content bg-transparent focus:outline-none"
              />
            </div>

            {/* Attachment chip */}
            {estimate && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 bg-brand border border-border-primary rounded-badge px-[8px] py-[3px]">
                  <Paperclip size={12} className="text-content-primary shrink-0" />
                  <span className="font-crm text-body-3 text-content-primary whitespace-nowrap">
                    {estimate.name}
                  </span>
                  <span className="font-crm text-body-3 text-content-subtlest ml-1">
                    {formatCurrency(estimate.amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Body */}
            <textarea
              value={form.body}
              onChange={e => set('body', e.target.value)}
              rows={9}
              className="w-full mt-2 font-crm text-body-3 text-content bg-transparent focus:outline-none resize-none placeholder:text-content-disabled"
            />

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-card border border-border font-crm text-body-3 text-content-subtlest hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!form.to.trim()}
              className="flex-1 py-2.5 rounded-card bg-brand-action font-crm text-body-3 font-bold text-content-invert hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {mode === 'send' ? 'Send estimate' : 'Send follow-up'}
            </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}
