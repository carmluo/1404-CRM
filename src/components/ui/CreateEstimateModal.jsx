// Figma node 1478:17184 — create new estimate modal
// Card: bg-surface-white rounded-card shadow-panel flex flex-col gap-[24px] pt-[24px] pb-[32px] px-[24px]
// Header: flex items-center justify-between gap-[10px]
//   Title: Heading/H6 bold flex-1
//   Cancel btn: h-[40px] px-[12px] py-[8px] rounded-[12px] bg-surface-white, B3 bold text-content-primary
//   Save btn:   h-[40px] px-[12px] py-[8px] rounded-[12px], B3 bold text-content-invert
//     disabled → bg-brand-hover; enabled → bg-brand-action
// Form: grid grid-cols-2 gap-x-[24px] gap-y-[24px]
//   Estimate name / Amount: col-span-2 px-[12px], label B2 text-content, input h-[47px] rounded-badge px-[12px] py-[10px] + ChevronDown size-20
//   Notes: col-span-2 (no extra px), label B2 + "(optional)" B3 text-disabled, textarea h-[122px] rounded-badge px-[12px] py-[10px]

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function toFileName(str) {
  return str
    .replace(/[—–-]+/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

function inputWrapCls(hasError) {
  return `w-full h-[47px] flex items-center justify-between px-[12px] py-[10px] bg-surface-white border rounded-badge focus-within:border-border-primary transition-colors ${
    hasError ? 'border-danger-border' : 'border-border'
  }`
}

export default function CreateEstimateModal({
  isOpen,
  onClose,
  oppId,
  oppTitle,
  accountName,
  opps,
}) {
  const { addEstimate, showToast } = useApp()

  const [selectedOppId, setSelectedOppId] = useState('')
  const resolvedOppId = oppId || selectedOppId
  const resolvedOppTitle = oppTitle || opps?.find(o => o.id === selectedOppId)?.title || ''
  const suggestedName = resolvedOppTitle
    ? `${toFileName(resolvedOppTitle)}_Estimate_v1.pdf`
    : 'Estimate_v1.pdf'

  const [form, setForm] = useState({ name: '', amount: '', notes: '' })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const isFormValid =
    form.name.trim() !== '' &&
    form.amount !== '' &&
    !isNaN(Number(form.amount)) &&
    Number(form.amount) > 0 &&
    (!opps || resolvedOppId !== '')

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
    showToast('Estimate created')
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
      <div className="relative bg-surface-white rounded-card shadow-[0px_2px_4px_0px_rgba(173,173,173,0.25),-2px_4px_12px_0px_rgba(203,203,203,0.5)] w-[480px] min-w-[45vw] z-[51] flex flex-col gap-[24px] pt-[24px] pb-[32px] px-[24px]">

        {/* Header: title + buttons */}
        <div className="flex items-center justify-between gap-[10px]">
          <h2 className="flex-1 font-crm text-h6 font-bold text-content">Create new estimate</h2>
          <div className="flex items-center gap-[16px] shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="h-[40px] px-[12px] py-[8px] rounded-[12px] bg-surface-white font-crm text-body-3 font-bold text-content-primary whitespace-nowrap hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`h-[40px] px-[12px] py-[8px] rounded-[12px] font-crm text-body-3 font-bold text-content-invert whitespace-nowrap transition-colors ${
                isFormValid
                  ? 'bg-brand-action hover:bg-brand-action-hover'
                  : 'bg-brand-hover cursor-not-allowed'
              }`}
            >
              Save estimate
            </button>
          </div>
        </div>

        {/* Context: account / opp name (shown when provided) */}
        {(accountName || oppTitle) && (
          <div className="flex items-center gap-2 flex-wrap -mt-3">
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
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[24px] w-full">

          {/* Opportunity selector — shown only when multiple opps passed */}
          {opps && (
            <div className="col-span-2 flex flex-col gap-[4px]">
              <p className="font-crm text-body-2 text-content">
                Opportunity <span className="text-danger-text">*</span>
              </p>
              <div className={inputWrapCls(!!errors.opp)}>
                <select
                  value={selectedOppId}
                  onChange={e => { setSelectedOppId(e.target.value); setErrors(er => ({ ...er, opp: '' })) }}
                  className="flex-1 min-w-0 bg-transparent font-crm text-body-2 text-content focus:outline-none appearance-none"
                >
                  <option value="">Select opportunity…</option>
                  {opps.map(o => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="text-content-disabled shrink-0" />
              </div>
              {errors.opp && <p className="font-crm text-body-3 text-danger-text">{errors.opp}</p>}
            </div>
          )}

          {/* Estimate name */}
          <div className="col-span-2 flex flex-col gap-[4px]">
            <p className="font-crm text-body-2 text-content">
              Estimate name <span className="text-danger-text">*</span>
            </p>
            <div className={inputWrapCls(!!errors.name)}>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder={suggestedName}
                className="flex-1 min-w-0 bg-transparent font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none"
              />
              <ChevronDown size={20} className="text-content-disabled shrink-0" />
            </div>
            {errors.name && <p className="font-crm text-body-3 text-danger-text">{errors.name}</p>}
          </div>

          {/* Amount */}
          <div className="col-span-2 flex flex-col gap-[4px]">
            <p className="font-crm text-body-2 text-content">
              Amount ($) <span className="text-danger-text">*</span>
            </p>
            <div className={inputWrapCls(!!errors.amount)}>
              <input
                type="number"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                placeholder="0"
                min="0"
                className="flex-1 min-w-0 bg-transparent font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none"
              />
              <ChevronDown size={20} className="text-content-disabled shrink-0" />
            </div>
            {errors.amount && <p className="font-crm text-body-3 text-danger-text">{errors.amount}</p>}
          </div>

          {/* Notes */}
          <div className="col-span-2 flex flex-col gap-[4px]">
            <p className="font-crm text-body-2 text-content">
              Notes{' '}
              <span className="font-crm text-body-3 text-content-disabled">(optional)</span>
            </p>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Scope notes, exclusions, assumptions..."
              className="h-[122px] w-full px-[12px] py-[10px] bg-surface-white border border-border rounded-badge font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary resize-none transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  )
}
