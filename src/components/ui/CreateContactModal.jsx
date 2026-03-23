import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Sparkles, Loader2, Check } from 'lucide-react'
import { accounts } from '../../data/mockData'

const REPS = ['Marcus Reynolds', 'Sarah Kim']
const PREFERRED_COMMS = ['Email', 'Phone', 'Text', 'In-Person']
const ENGAGEMENT_LEVELS = ['High', 'Medium', 'Low', 'Cold']

function simulateContactLookup(name) {
  const titles = [
    'Director of Facilities', 'VP of Operations', 'Procurement Manager',
    'Regional Construction Manager', 'Store Development Lead', 'Capital Projects Director',
    'Head of Store Planning', 'Senior Project Manager',
  ]
  const phones = ['(555) 201-4433', '(555) 348-9021', '(555) 467-1122']
  const locations = ['Chicago, IL', 'Dallas, TX', 'Atlanta, GA', 'New York, NY', 'Los Angeles, CA']
  const idx = name.length % titles.length
  const n = name.toLowerCase()
  return {
    title: titles[idx],
    email: `${n.split(' ')[0] || 'contact'}@${n.split(' ')[1] || 'company'}.com`,
    phone: phones[idx % phones.length],
    location: locations[idx % locations.length],
  }
}

const inputCls = 'w-full bg-surface-white border border-border rounded-[4px] px-[12px] py-[10px] font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary transition-colors'

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-crm text-body-2 text-content">{label}</p>
      {children}
      {error && <p className="font-crm text-body-3 text-danger-text">{error}</p>}
    </div>
  )
}

function SelectField({ value, onChange, children }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputCls} appearance-none pr-10`}
      >
        {children}
      </select>
      <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-content-disabled pointer-events-none" />
    </div>
  )
}

function OwnerCombobox({ value, onChange }) {
  const [inputVal, setInputVal] = useState(value || '')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const filtered = REPS.filter(r => r.toLowerCase().includes(inputVal.toLowerCase()))

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function select(rep) {
    setInputVal(rep)
    onChange(rep)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={inputVal}
        onChange={e => { setInputVal(e.target.value); onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search reps..."
        className={inputCls}
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface-white border border-border rounded-[4px] shadow-card z-10 overflow-hidden">
          {filtered.map(rep => (
            <button
              key={rep}
              type="button"
              onMouseDown={() => select(rep)}
              className="w-full text-left px-[12px] py-[10px] font-crm text-body-3 text-content hover:bg-surface flex items-center justify-between"
            >
              {rep}
              {value === rep && <Check size={13} className="text-content-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function AutoBadge({ show }) {
  if (!show) return null
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-[4px] font-crm text-[10px] font-bold ml-1.5 bg-brand text-content-primary">
      <Sparkles size={9} />
      Auto-filled
    </span>
  )
}

function AccountCombobox({ accountId, accountName, onSelect }) {
  const [inputVal, setInputVal] = useState(accountName || '')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const filtered = accounts.filter(a =>
    a.name.toLowerCase().includes(inputVal.toLowerCase())
  )
  const hasExactMatch = accounts.some(
    a => a.name.toLowerCase() === inputVal.toLowerCase()
  )
  const showNewOption = inputVal.trim().length > 0 && !hasExactMatch

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectExisting(account) {
    setInputVal(account.name)
    onSelect({ accountId: account.id, accountName: account.name })
    setOpen(false)
  }

  function selectNew() {
    onSelect({ accountId: '', accountName: inputVal.trim() })
    setOpen(false)
  }

  function handleInput(e) {
    const val = e.target.value
    setInputVal(val)
    onSelect({ accountId: '', accountName: val })
    setOpen(true)
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        value={inputVal}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder="Select or type account name"
        className={inputCls}
      />
      {open && (inputVal.trim().length > 0) && (filtered.length > 0 || showNewOption) && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-surface-white border border-border rounded-[4px] shadow-card z-10 overflow-hidden max-h-48 overflow-y-auto">
          {filtered.map(account => (
            <button
              key={account.id}
              type="button"
              onMouseDown={() => selectExisting(account)}
              className="w-full text-left px-[12px] py-[10px] font-crm text-body-3 text-content hover:bg-surface flex items-center justify-between"
            >
              {account.name}
              {accountId === account.id && <Check size={13} className="text-content-primary" />}
            </button>
          ))}
          {showNewOption && (
            <button
              type="button"
              onMouseDown={selectNew}
              className="w-full text-left px-[12px] py-[10px] font-crm text-body-3 text-content-primary hover:bg-surface border-t border-border"
            >
              + Create new account "{inputVal.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function CreateContactModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    title: '',
    accountId: '',
    accountName: '',
    email: '',
    phone: '',
    location: '',
    preferredCommunication: 'Email',
    engagement: 'Medium',
    accountOwner: 'Marcus Reynolds',
  })
  const [errors, setErrors] = useState({})
  const [lookupState, setLookupState] = useState('idle')
  const [autoFilledFields, setAutoFilledFields] = useState([])

  if (!isOpen) return null

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    if (autoFilledFields.includes(field)) {
      setAutoFilledFields(prev => prev.filter(f => f !== field))
    }
  }

  function handleLookup() {
    if (!form.name.trim()) return
    setLookupState('loading')
    setTimeout(() => {
      const result = simulateContactLookup(form.name)
      const filled = []
      setForm(prev => {
        const next = { ...prev }
        if (result.title && !prev.title) { next.title = result.title; filled.push('title') }
        if (result.email && !prev.email) { next.email = result.email; filled.push('email') }
        if (result.phone && !prev.phone) { next.phone = result.phone; filled.push('phone') }
        if (result.location && !prev.location) { next.location = result.location; filled.push('location') }
        return next
      })
      setAutoFilledFields(filled)
      setLookupState('done')
    }, 1600)
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onAdd({
      id: `cnt-new-${Date.now()}`,
      name: form.name,
      title: form.title,
      accountId: form.accountId,
      account: form.accountName,
      email: form.email,
      phone: form.phone,
      location: form.location,
      preferredCommunication: form.preferredCommunication,
      engagement: form.engagement,
      accountOwner: form.accountOwner,
      lastContacted: null,
      createdAt: new Date().toISOString().split('T')[0],
    })
    onClose()
    resetForm()
  }

  function resetForm() {
    setForm({ name: '', title: '', accountId: '', accountName: '', email: '', phone: '', location: '', preferredCommunication: 'Email', engagement: 'Medium', accountOwner: 'Marcus Reynolds' })
    setErrors({})
    setLookupState('idle')
    setAutoFilledFields([])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={() => { onClose(); resetForm() }} />
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
          <h2 className="font-crm text-h6 font-bold text-content">Create new contact</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => { onClose(); resetForm() }}
              className="h-10 px-3 py-2 rounded-[12px] font-crm text-body-3 font-bold text-content-primary hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="h-10 px-3 py-2 rounded-[12px] font-crm text-body-3 font-bold bg-brand-action text-content-invert hover:bg-brand-action-hover transition-colors"
            >
              Create contact
            </button>
          </div>
        </div>

        {/* Form — 2-column grid */}
        <div className="grid grid-cols-2 gap-6">

          {/* Full name */}
          <div className="flex flex-col gap-1">
            <p className="font-crm text-body-2 text-content">
              Full name<span className="text-danger-text ml-0.5">*</span>
            </p>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Jordan Lee"
              className={`${inputCls} ${errors.name ? 'border-danger-border' : ''}`}
            />
            {errors.name && <p className="font-crm text-body-3 text-danger-text">{errors.name}</p>}
          </div>

          {/* Job title */}
          <Field label={<>Job title<AutoBadge show={autoFilledFields.includes('title')} /></>}>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. Director of Facilities"
              className={inputCls}
            />
          </Field>

          {/* Web lookup banner — only when both name and account are provided */}
          {form.name.trim().length > 2 && form.accountName.trim().length > 0 && lookupState === 'idle' && (
            <div className="col-span-2 flex items-center justify-between px-3.5 py-2.5 rounded-[8px] border border-border-primary bg-brand">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-content-primary" />
                <span className="font-crm text-body-3 text-content-primary">Auto-fill details from the web?</span>
              </div>
              <button
                type="button"
                onClick={handleLookup}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] font-crm text-body-3 font-bold text-content-invert bg-brand-action hover:bg-brand-action-hover transition-colors"
              >
                <Sparkles size={12} />
                Look up
              </button>
            </div>
          )}

          {lookupState === 'loading' && (
            <div className="col-span-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[8px] border border-border-primary bg-brand">
              <Loader2 size={14} className="animate-spin text-content-primary" />
              <span className="font-crm text-body-3 text-content-primary">Looking up "{form.name}"…</span>
            </div>
          )}

          {lookupState === 'done' && (
            <div className="col-span-2 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[8px] border border-border-primary bg-brand">
              <Check size={14} className="text-content-primary" />
              <span className="font-crm text-body-3 text-content-primary">Details auto-filled from the web</span>
            </div>
          )}

          {/* Account */}
          <Field label="Account">
            <AccountCombobox
              accountId={form.accountId}
              accountName={form.accountName}
              onSelect={({ accountId, accountName }) => {
                setForm(prev => ({ ...prev, accountId, accountName }))
                setLookupState('idle')
                setAutoFilledFields([])
              }}
            />
          </Field>

          {/* Email */}
          <Field label={<>Email<AutoBadge show={autoFilledFields.includes('email')} /></>}>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="name@company.com"
              className={inputCls}
            />
          </Field>

          {/* Phone */}
          <Field label={<>Phone<AutoBadge show={autoFilledFields.includes('phone')} /></>}>
            <input
              type="tel"
              value={form.phone}
              onChange={e => handleChange('phone', e.target.value)}
              placeholder="(555) 000-0000"
              className={inputCls}
            />
          </Field>

          {/* Location */}
          <Field label={<>Location<AutoBadge show={autoFilledFields.includes('location')} /></>}>
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              placeholder="City, ST"
              className={inputCls}
            />
          </Field>

          {/* Preferred communication */}
          <Field label="Preferred communication">
            <SelectField value={form.preferredCommunication} onChange={e => handleChange('preferredCommunication', e.target.value)}>
              {PREFERRED_COMMS.map(c => <option key={c} value={c}>{c}</option>)}
            </SelectField>
          </Field>

          {/* Engagement — pill selector */}
          <div className="flex flex-col gap-2">
            <p className="font-crm text-body-2 text-content">Engagement</p>
            <div className="flex flex-wrap gap-2">
              {ENGAGEMENT_LEVELS.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleChange('engagement', level)}
                  className={`pl-[10px] pr-3 py-[4px] rounded-[100px] font-crm text-body-3 transition-colors ${
                    form.engagement === level
                      ? 'bg-viz-dark text-content-invert'
                      : 'border border-border text-content-subtlest hover:border-border-hover'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Account owner */}
          <Field label="Account owner">
            <OwnerCombobox value={form.accountOwner} onChange={v => handleChange('accountOwner', v)} />
          </Field>
          <div />

        </div>
      </motion.div>
    </div>
  )
}
