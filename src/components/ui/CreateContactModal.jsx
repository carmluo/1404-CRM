import { useState, useRef, useEffect } from 'react'
import { X, Plus, Sparkles, Loader2, Check } from 'lucide-react'
import { accounts } from '../../data/mockData'

const REPS = ['Marcus Reynolds', 'Sarah Kim']
const PREFERRED_COMMS = ['Email', 'Phone', 'Text', 'In-Person']
const ENGAGEMENT_LEVELS = ['High', 'Medium', 'Low', 'Cold']

// Simulate looking up a contact by name
function simulateContactLookup(name) {
  const n = name.toLowerCase()
  const titles = [
    'Director of Facilities', 'VP of Operations', 'Procurement Manager',
    'Regional Construction Manager', 'Store Development Lead', 'Capital Projects Director',
    'Head of Store Planning', 'Senior Project Manager',
  ]
  const emails = ['jdoe@example.com', 'contact@acmecorp.com', 'info@enterprise.org']
  const phones = ['(555) 201-4433', '(555) 348-9021', '(555) 467-1122']
  const locations = ['Chicago, IL', 'Dallas, TX', 'Atlanta, GA', 'New York, NY', 'Los Angeles, CA']

  // Deterministic-ish based on name length
  const idx = name.length % titles.length
  return {
    title: titles[idx],
    email: `${n.split(' ')[0]?.toLowerCase() || 'contact'}@${n.split(' ')[1]?.toLowerCase() || 'company'}.com`,
    phone: phones[idx % phones.length],
    location: locations[idx % locations.length],
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

export default function CreateContactModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    title: '',
    accountId: '',
    email: '',
    phone: '',
    location: '',
    preferredCommunication: 'Email',
    engagement: 'Medium',
    accountOwner: 'Marcus Reynolds',
  })
  const [errors, setErrors] = useState({})
  const [lookupState, setLookupState] = useState('idle') // idle | loading | done
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
    const account = accounts.find(a => a.id === form.accountId)
    const newContact = {
      id: `cnt-new-${Date.now()}`,
      name: form.name,
      title: form.title,
      accountId: form.accountId,
      account: account?.name || '',
      email: form.email,
      phone: form.phone,
      location: form.location,
      preferredCommunication: form.preferredCommunication,
      engagement: form.engagement,
      accountOwner: form.accountOwner,
      lastContacted: null,
      createdAt: new Date().toISOString().split('T')[0],
    }
    onAdd(newContact)
    onClose()
    resetForm()
  }

  function resetForm() {
    setForm({ name: '', title: '', accountId: '', email: '', phone: '', location: '', preferredCommunication: 'Email', engagement: 'Medium', accountOwner: 'Marcus Reynolds' })
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
            <h2 className="font-semibold text-[#21272a]">New Contact</h2>
          </div>
          <button onClick={() => { onClose(); resetForm() }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#838383]">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Jordan Lee"
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
                <Sparkles size={11} />
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Job title <AutoBadge field="title" />
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. Director of Facilities"
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">Account</label>
            <select
              value={form.accountId}
              onChange={e => handleChange('accountId', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] bg-white"
            >
              <option value="">No account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">
                Email <AutoBadge field="email" />
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => handleChange('email', e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">
                Phone <AutoBadge field="phone" />
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Location <AutoBadge field="location" />
            </label>
            <input
              type="text"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
              placeholder="City, ST"
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
            />
          </div>

          {/* Preferred comm + Engagement */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Preferred communication</label>
              <select
                value={form.preferredCommunication}
                onChange={e => handleChange('preferredCommunication', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] bg-white"
              >
                {PREFERRED_COMMS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Engagement</label>
              <div className="flex flex-wrap gap-1.5">
                {ENGAGEMENT_LEVELS.map(level => (
                  <button
                    key={level}
                    onClick={() => handleChange('engagement', level)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                    style={{
                      backgroundColor: form.engagement === level ? '#2d2d2d' : 'white',
                      color: form.engagement === level ? 'white' : '#565656',
                      borderColor: form.engagement === level ? '#2d2d2d' : '#e5e5e5',
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
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
            Create Contact
          </button>
        </div>
      </div>
    </div>
  )
}
