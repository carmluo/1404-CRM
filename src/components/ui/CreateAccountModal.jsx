import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Globe, Sparkles, Loader2, Check } from 'lucide-react'

const REPS = ['Marcus Reynolds', 'Sarah Kim']
const ACCOUNT_TYPES = ['General Contractor', 'Retail', 'Franchise', 'Corporate', 'Distributor', 'Other']
const STATUSES = ['Active', 'Prospect', 'At Risk', 'Inactive']
const INDUSTRIES = ['Retail', 'Construction', 'Hospitality', 'Healthcare', 'Food & Beverage', 'Automotive', 'Education', 'Government', 'Technology', 'Other']

function simulateLookup(name) {
  const n = name.toLowerCase()
  if (n.includes('home') || n.includes('depot') || n.includes('hardware')) {
    return { industry: 'Retail', annualRevenue: '132000000000', overview: 'A leading home improvement retailer offering tools, building materials, and home improvement products across thousands of locations nationwide.', address: '2455 Paces Ferry Rd NW, Atlanta, GA 30339' }
  }
  if (n.includes('lowes') || n.includes("lowe's")) {
    return { industry: 'Retail', annualRevenue: '97000000000', overview: 'A Fortune 50 home improvement company serving approximately 19 million customers a week in the US and Canada.', address: '1000 Lowes Blvd, Mooresville, NC 28117' }
  }
  if (n.includes('target')) {
    return { industry: 'Retail', annualRevenue: '109000000000', overview: 'An American retail corporation headquartered in Minneapolis, offering a wide range of general merchandise and grocery products.', address: '1000 Nicollet Mall, Minneapolis, MN 55403' }
  }
  if (n.includes('walmart')) {
    return { industry: 'Retail', annualRevenue: '611000000000', overview: 'An American multinational retail corporation operating a chain of hypermarkets, discount department stores, and grocery stores.', address: '702 SW 8th St, Bentonville, AR 72716' }
  }
  return {
    industry: 'Retail',
    annualRevenue: '25000000',
    overview: `${name} is a recognized industry player with a strong regional presence and an established track record in customer satisfaction and operational excellence.`,
    address: '',
  }
}

const inputCls = 'w-full bg-surface-white border border-border rounded-[4px] px-[12px] py-[10px] font-crm text-body-2 text-content placeholder:text-content-disabled focus:outline-none focus:border-border-primary transition-colors'

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-crm text-body-2 text-content">
        {label}
        {required && <span className="text-danger-text ml-0.5">*</span>}
      </p>
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

export default function CreateAccountModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    website: '',
    type: '',
    status: 'Prospect',
    industry: '',
    annualRevenue: '',
    address: '',
    accountOwner: 'Marcus Reynolds',
    overview: '',
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
      const result = simulateLookup(form.name)
      setForm(prev => ({
        ...prev,
        industry: result.industry || prev.industry,
        annualRevenue: result.annualRevenue || prev.annualRevenue,
        overview: result.overview || prev.overview,
        address: result.address || prev.address,
      }))
      setAutoFilledFields(['industry', 'annualRevenue', 'overview', 'address'].filter(f => !!result[f === 'annualRevenue' ? 'annualRevenue' : f]))
      setLookupState('done')
    }, 1600)
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Company name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onAdd({
      id: `acc-new-${Date.now()}`,
      name: form.name,
      website: form.website,
      type: form.type,
      status: form.status,
      industry: form.industry,
      annualRevenue: parseFloat(form.annualRevenue) || 0,
      address: form.address,
      accountOwner: form.accountOwner,
      overview: form.overview,
      pipelineValue: 0,
      activeOpportunities: 0,
      contacts: [],
      lastActivity: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    })
    onClose()
    resetForm()
  }

  function resetForm() {
    setForm({ name: '', website: '', type: '', status: 'Prospect', industry: '', annualRevenue: '', address: '', accountOwner: 'Marcus Reynolds', overview: '' })
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
          <h2 className="font-crm text-h6 font-bold text-content">Create new account</h2>
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
              Create account
            </button>
          </div>
        </div>

        {/* Form — 2-column grid */}
        <div className="grid grid-cols-2 gap-6">

          {/* Company name */}
          <Field label="Company name" required error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Acme Corp"
              className={`${inputCls} ${errors.name ? 'border-danger-border' : ''}`}
            />
          </Field>

          {/* Website */}
          <Field label="Website">
            <input
              type="url"
              value={form.website}
              onChange={e => handleChange('website', e.target.value)}
              placeholder="https://example.com"
              className={inputCls}
            />
          </Field>

          {/* Web lookup banner — spans full width when visible */}
          {form.name.trim().length > 2 && lookupState === 'idle' && (
            <div
              className="col-span-2 flex items-center justify-between px-3.5 py-2.5 rounded-[8px] border border-border-primary bg-brand"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-content-primary" />
                <span className="font-crm text-body-3 text-content-primary">Auto-fill details from the web?</span>
              </div>
              <button
                type="button"
                onClick={handleLookup}
                className="flex items-center gap-1.5 px-3 py-1 rounded-[8px] font-crm text-body-3 font-bold text-content-invert bg-brand-action hover:bg-brand-action-hover transition-colors"
              >
                <Globe size={12} />
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

          {/* Type */}
          <Field label="Type">
            <SelectField value={form.type} onChange={e => handleChange('type', e.target.value)}>
              <option value="">Select type</option>
              {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </SelectField>
          </Field>

          {/* Status */}
          <Field label="Status">
            <SelectField value={form.status} onChange={e => handleChange('status', e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </SelectField>
          </Field>

          {/* Industry */}
          <Field label={<>Industry<AutoBadge show={autoFilledFields.includes('industry')} /></>}>
            <SelectField value={form.industry} onChange={e => handleChange('industry', e.target.value)}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </SelectField>
          </Field>

          {/* Annual revenue */}
          <Field label={<>Annual revenue ($)<AutoBadge show={autoFilledFields.includes('annualRevenue')} /></>}>
            <input
              type="number"
              value={form.annualRevenue}
              onChange={e => handleChange('annualRevenue', e.target.value)}
              placeholder="0"
              className={inputCls}
            />
          </Field>

          {/* Address — full width */}
          <div className="col-span-2 flex flex-col gap-1">
            <p className="font-crm text-body-2 text-content">
              Address<AutoBadge show={autoFilledFields.includes('address')} />
            </p>
            <input
              type="text"
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="123 Main St, City, ST 00000"
              className={inputCls}
            />
          </div>

          {/* Company overview — full width */}
          <div className="col-span-2 flex flex-col gap-1">
            <p className="font-crm text-body-2 text-content">
              Company overview<AutoBadge show={autoFilledFields.includes('overview')} />
            </p>
            <textarea
              value={form.overview}
              onChange={e => handleChange('overview', e.target.value)}
              rows={3}
              placeholder="Brief description of the company…"
              className={`${inputCls} resize-none`}
            />
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
