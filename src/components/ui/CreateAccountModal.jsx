import { useState, useRef, useEffect } from 'react'
import { X, Plus, Globe, Sparkles, Loader2, Check } from 'lucide-react'
import { accounts } from '../../data/mockData'

const REPS = ['Marcus Reynolds', 'Sarah Kim']

const ACCOUNT_TYPES = ['General Contractor', 'Retail', 'Franchise', 'Corporate', 'Distributor', 'Other']
const STATUSES = ['Active', 'Prospect', 'At Risk', 'Inactive']
const INDUSTRIES = ['Retail', 'Construction', 'Hospitality', 'Healthcare', 'Food & Beverage', 'Automotive', 'Education', 'Government', 'Technology', 'Other']

// Simulate web-lookup results per keyword patterns
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
  // Generic fallback
  return {
    industry: 'Retail',
    annualRevenue: '25000000',
    overview: `${name} is a recognized industry player with a strong regional presence and an established track record in customer satisfaction and operational excellence.`,
    address: '',
  }
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
        className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-10 overflow-hidden">
          {filtered.map(rep => (
            <button
              key={rep}
              onMouseDown={() => select(rep)}
              className="w-full text-left px-3 py-2 text-sm text-[#21272a] hover:bg-[#f4f4f4] flex items-center justify-between"
            >
              {rep}
              {value === rep && <Check size={13} className="text-[#2B6B52]" />}
            </button>
          ))}
        </div>
      )}
    </div>
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
  const [lookupState, setLookupState] = useState('idle') // idle | loading | done
  const [autoFilledFields, setAutoFilledFields] = useState([])

  if (!isOpen) return null

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
    // Reset autofill badge if user manually edits an auto-filled field
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
      setAutoFilledFields(['industry', 'annualRevenue', 'overview', 'address'].filter(f => !!simulateLookup(form.name)[f === 'annualRevenue' ? 'annualRevenue' : f]))
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
    const newAccount = {
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
    }
    onAdd(newAccount)
    onClose()
    resetForm()
  }

  function resetForm() {
    setForm({ name: '', website: '', type: '', status: 'Prospect', industry: '', annualRevenue: '', address: '', accountOwner: 'Marcus Reynolds', overview: '' })
    setErrors({})
    setLookupState('idle')
    setAutoFilledFields([])
  }

  function AutoBadge({ field }) {
    if (!autoFilledFields.includes(field)) return null
    return (
      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ml-1.5" style={{ backgroundColor: '#E8F5F0', color: '#2B6B52' }}>
        <Sparkles size={9} />
        Auto-filled
      </span>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { onClose(); resetForm() }} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[520px] max-h-[90vh] overflow-y-auto z-51 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5] shrink-0">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-[#2B6B52]" />
            <h2 className="font-semibold text-[#21272a]">New Account</h2>
          </div>
          <button onClick={() => { onClose(); resetForm() }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#838383]">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Company name */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Company name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Acme Corp"
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#2B6B52] ${errors.name ? 'border-red-400' : 'border-[#dde1e6]'}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Web lookup prompt */}
          {form.name.trim().length > 2 && lookupState === 'idle' && (
            <div
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border"
              style={{ backgroundColor: '#f0faf6', borderColor: '#b6ddd0' }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: '#2B6B52' }} />
                <span className="text-xs text-[#2B6B52] font-medium">Auto-fill details from the web?</span>
              </div>
              <button
                onClick={handleLookup}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white transition-colors"
                style={{ backgroundColor: '#2B6B52' }}
              >
                <Globe size={11} />
                Look up
              </button>
            </div>
          )}

          {lookupState === 'loading' && (
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
              style={{ backgroundColor: '#f0faf6', borderColor: '#b6ddd0' }}
            >
              <Loader2 size={14} className="animate-spin" style={{ color: '#2B6B52' }} />
              <span className="text-xs text-[#2B6B52] font-medium">Looking up "{form.name}"…</span>
            </div>
          )}

          {lookupState === 'done' && (
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
              style={{ backgroundColor: '#f0faf6', borderColor: '#b6ddd0' }}
            >
              <Check size={14} style={{ color: '#2B6B52' }} />
              <span className="text-xs text-[#2B6B52] font-medium">Details auto-filled from the web</span>
            </div>
          )}

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={e => handleChange('website', e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
            />
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] bg-white"
              >
                <option value="">Select type</option>
                {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] bg-white"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Industry + Revenue */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">
                Industry <AutoBadge field="industry" />
              </label>
              <select
                value={form.industry}
                onChange={e => handleChange('industry', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] bg-white"
              >
                <option value="">Select industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">
                Annual revenue ($) <AutoBadge field="annualRevenue" />
              </label>
              <input
                type="number"
                value={form.annualRevenue}
                onChange={e => handleChange('annualRevenue', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Address <AutoBadge field="address" />
            </label>
            <input
              type="text"
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="123 Main St, City, ST 00000"
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
            />
          </div>

          {/* Overview */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Company overview <AutoBadge field="overview" />
            </label>
            <textarea
              value={form.overview}
              onChange={e => handleChange('overview', e.target.value)}
              rows={3}
              placeholder="Brief description of the company…"
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] resize-none"
            />
          </div>

          {/* Account Owner */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">Account owner</label>
            <OwnerCombobox value={form.accountOwner} onChange={v => handleChange('accountOwner', v)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e5e5] flex gap-3 shrink-0">
          <button
            onClick={() => { onClose(); resetForm() }}
            className="flex-1 py-2.5 rounded-lg border border-[#e5e5e5] text-sm text-[#565656] font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm text-white font-medium transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: '#2B6B52' }}
          >
            <Plus size={16} />
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}
