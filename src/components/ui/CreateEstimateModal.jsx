import { useState } from 'react'
import { X, FileText } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function toFileName(str) {
  return str
    .replace(/[—–-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export default function CreateEstimateModal({
  isOpen,
  onClose,
  oppId,       // single opp (OpportunityDetail)
  oppTitle,    // single opp title
  accountName,
  opps,        // array of { id, title } — shown when multiple opps exist (AccountDetail)
}) {
  const { addEstimate } = useApp()

  const [selectedOppId, setSelectedOppId] = useState('')
  const resolvedOppId = oppId || selectedOppId
  const resolvedOppTitle = oppTitle || opps?.find(o => o.id === selectedOppId)?.title || ''
  const suggestedName = resolvedOppTitle
    ? `${toFileName(resolvedOppTitle)}_Estimate_v1.pdf`
    : 'Estimate_v1.pdf'

  const [form, setForm] = useState({ name: '', amount: '', notes: '' })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (opps && !resolvedOppId) errs.opp = 'Select an opportunity'
    if (!form.name.trim()) errs.name = 'Estimate name is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    addEstimate(resolvedOppId, {
      id: `est-${Date.now()}`,
      name: form.name.trim() || suggestedName,
      amount: Number(form.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'Drafted',
      notes: form.notes,
    })
    handleClose()
  }

  function handleClose() {
    setForm({ name: '', amount: '', notes: '' })
    setErrors({})
    setSelectedOppId('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-surface-white rounded-2xl shadow-2xl w-[480px] z-[51] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-content-primary" />
            <h2 className="font-crm text-body-2 font-bold text-content">New Estimate</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-card hover:bg-surface text-content-disabled transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Context */}
        {(accountName || oppTitle) && (
          <div className="px-6 pt-4 flex items-center gap-2 flex-wrap">
            {accountName && (
              <span className="font-crm text-body-3 text-content-subtlest bg-surface px-[8px] py-[2px] rounded-badge shrink-0">
                {accountName}
              </span>
            )}
            {oppTitle && (
              <span className="font-crm text-body-3 text-content-subtlest truncate">{oppTitle}</span>
            )}
          </div>
        )}

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Opportunity selector — shown only when multiple opps are passed */}
          {opps && (
            <div>
              <label className="block font-crm text-body-3 font-bold text-content mb-1.5">
                Opportunity <span className="text-danger-text">*</span>
              </label>
              <select
                value={selectedOppId}
                onChange={e => { setSelectedOppId(e.target.value); setErrors(er => ({ ...er, opp: '' })) }}
                className={`w-full px-3 py-2 rounded-card border font-crm text-body-3 text-content focus:outline-none focus:border-border-primary transition-colors bg-surface-white ${
                  errors.opp ? 'border-danger-border' : 'border-border-input'
                }`}
              >
                <option value="">Select opportunity…</option>
                {opps.map(o => (
                  <option key={o.id} value={o.id}>{o.title}</option>
                ))}
              </select>
              {errors.opp && (
                <p className="font-crm text-body-3 text-danger-text mt-1">{errors.opp}</p>
              )}
            </div>
          )}

          {/* Estimate name */}
          <div>
            <label className="block font-crm text-body-3 font-bold text-content mb-1.5">
              Estimate name <span className="text-danger-text">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder={suggestedName}
              className={`w-full px-3 py-2 rounded-card border font-crm text-body-3 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary transition-colors ${
                errors.name ? 'border-danger-border' : 'border-border-input'
              }`}
            />
            {errors.name && (
              <p className="font-crm text-body-3 text-danger-text mt-1">{errors.name}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-crm text-body-3 font-bold text-content mb-1.5">
              Amount ($) <span className="text-danger-text">*</span>
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0"
              min="0"
              className={`w-full px-3 py-2 rounded-card border font-crm text-body-3 text-content focus:outline-none focus:border-border-primary transition-colors ${
                errors.amount ? 'border-danger-border' : 'border-border-input'
              }`}
            />
            {errors.amount && (
              <p className="font-crm text-body-3 text-danger-text mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-crm text-body-3 font-bold text-content mb-1.5">
              Notes <span className="font-normal text-content-disabled">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Scope notes, exclusions, assumptions..."
              rows={3}
              className="w-full px-3 py-2 rounded-card border border-border-input font-crm text-body-3 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary resize-none transition-colors"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-card border border-border font-crm text-body-3 text-content-subtlest hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-card bg-brand-action font-crm text-body-3 font-bold text-content-invert hover:opacity-90 transition-opacity"
          >
            Save estimate
          </button>
        </div>

      </div>
    </div>
  )
}
