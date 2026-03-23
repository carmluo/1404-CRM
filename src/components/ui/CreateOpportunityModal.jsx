import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { accounts, contacts } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

const STAGES = ['Qualifying', 'Needs Analysis', 'Estimate Prep', 'Estimate Submitted', 'Negotiation', 'Verbal Commit']

const inputCls = 'w-full bg-surface-white border border-border rounded-[4px] px-[12px] py-[10px] font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary transition-colors'

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-crm text-body-2 text-content">
        {label}
        {required && <span className="text-danger-text ml-0.5">*</span>}
        {hint && <span className="font-crm text-body-3 text-content-subtlest ml-1">{hint}</span>}
      </p>
      {children}
      {error && <p className="font-crm text-body-3 text-danger-text">{error}</p>}
    </div>
  )
}

function SelectField({ value, onChange, error, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputCls} appearance-none pr-10 ${error ? 'border-danger-border' : ''}`}
      >
        {children}
      </select>
      <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-disabled pointer-events-none" />
    </div>
  )
}

export default function CreateOpportunityModal({ isOpen, onClose }) {
  const { addOpportunity } = useApp()
  const [form, setForm] = useState({
    title: '',
    accountId: '',
    contactId: '',
    stage: 'Qualifying',
    amount: '',
    closeDate: '',
    projectStart: '',
    dealProbability: 20,
    notes: '',
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const filteredContacts = form.accountId
    ? contacts.filter(c => c.accountId === form.accountId)
    : contacts

  function handleChange(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'accountId' ? { contactId: '' } : {}),
    }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.stage) errs.stage = 'Stage is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const account = accounts.find(a => a.id === form.accountId)
    const contact = contacts.find(c => c.id === form.contactId)
    addOpportunity({
      id: `opp-${Date.now()}`,
      title: form.title,
      account: account?.name || '',
      accountId: form.accountId,
      contact: contact?.name || '',
      contactId: form.contactId,
      amount: parseFloat(form.amount) || 0,
      stage: form.stage,
      dealProbability: parseInt(form.dealProbability) || 20,
      closeDate: form.closeDate,
      projectStart: form.projectStart,
      notes: form.notes,
      stageEntryDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      bids: [],
      biddingHistory: [],
      activities: { upcoming: [], log: [] },
      documents: [],
      estimates: [],
    })
    onClose()
    setForm({ title: '', accountId: '', contactId: '', stage: 'Qualifying', amount: '', closeDate: '', projectStart: '', dealProbability: 20, notes: '' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <motion.div
        className="relative bg-surface-white rounded-card w-full max-w-[868px] max-h-[90vh] overflow-y-auto flex flex-col gap-6 pt-6 px-6 pb-8"
        style={{ boxShadow: '0px 2px 4px 0px rgba(173,173,173,0.25), -2px 4px 12px 0px rgba(203,203,203,0.5)' }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ type: 'tween', duration: 0.15, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-crm text-h6 font-bold text-content">Create new opportunity</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="h-10 px-3 py-2 rounded-[12px] font-crm text-body-3 font-bold text-content-primary hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="h-10 px-3 py-2 rounded-[12px] font-crm text-body-3 font-bold bg-brand-action text-content-invert hover:bg-brand-action-hover transition-colors"
            >
              Create opportunity
            </button>
          </div>
        </div>

        {/* Form — 2-column grid */}
        <div className="grid grid-cols-2 gap-6">

          {/* Opportunity title */}
          <Field label="Opportunity title" required error={errors.title}>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="eg. Kitchen Remodel — Store #1842"
              className={`${inputCls} ${errors.title ? 'border-danger-border' : ''}`}
            />
          </Field>
          <div />

          {/* Amount */}
          <Field label="Amount ($)">
            <input
              type="number"
              value={form.amount}
              onChange={e => handleChange('amount', e.target.value)}
              placeholder="0"
              className={inputCls}
            />
          </Field>
          <div />

          {/* Stage — full width */}
          <div className="col-span-2 flex flex-col gap-2">
            <p className="font-crm text-body-2 text-content">
              Stage<span className="text-danger-text ml-0.5">*</span>
              {errors.stage && <span className="font-crm text-body-3 text-danger-text ml-2">{errors.stage}</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleChange('stage', s)}
                  className={`pl-[10px] pr-3 py-[4px] rounded-[100px] font-crm text-body-3 transition-colors ${
                    form.stage === s
                      ? 'bg-viz-dark text-content-invert'
                      : 'border border-border text-content-subtlest hover:border-border-hover'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Account */}
          <Field label="Account" hint="(if new account is entered, it will update in directory)">
            <SelectField value={form.accountId} onChange={e => handleChange('accountId', e.target.value)}>
              <option value="">Select or type account name</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </SelectField>
          </Field>

          {/* Contact */}
          <Field label="Contact" hint="(if new contact is entered, it will update in directory)">
            <SelectField value={form.contactId} onChange={e => handleChange('contactId', e.target.value)}>
              <option value="">Select or type contact name</option>
              {filteredContacts.map(c => <option key={c.id} value={c.id}>{c.name}{c.title ? ` — ${c.title}` : ''}</option>)}
            </SelectField>
          </Field>

          {/* Close date */}
          <Field label="Close date">
            <input
              type="date"
              value={form.closeDate}
              onChange={e => handleChange('closeDate', e.target.value)}
              className={inputCls}
            />
          </Field>

          {/* Project start */}
          <Field label="Project start">
            <input
              type="date"
              value={form.projectStart}
              onChange={e => handleChange('projectStart', e.target.value)}
              className={inputCls}
            />
          </Field>

          {/* Notes */}
          <Field label="Notes">
            <input
              type="text"
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Add additional notes"
              className={inputCls}
            />
          </Field>
          <div />

        </div>
      </motion.div>
    </div>
  )
}
