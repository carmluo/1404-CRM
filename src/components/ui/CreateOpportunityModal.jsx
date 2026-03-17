import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { accounts, contacts } from '../../data/mockData'
import { useApp } from '../../context/AppContext'

const STAGES = ['Qualifying', 'Needs Analysis', 'Estimate Prep', 'Estimate Submitted', 'Negotiation', 'Verbal Commit']
const STAGE_COLORS = {
  'Qualifying': '#5BBFA0',
  'Needs Analysis': '#9C59C5',
  'Estimate Prep': '#4A8FE0',
  'Estimate Submitted': '#F5A623',
  'Negotiation': '#8A9D35',
  'Verbal Commit': '#7B5EA7',
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
    if (!form.accountId) errs.accountId = 'Account is required'
    if (!form.stage) errs.stage = 'Stage is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit() {
    if (!validate()) return

    const account = accounts.find(a => a.id === form.accountId)
    const contact = contacts.find(c => c.id === form.contactId)

    const newOpp = {
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
      stageEntryDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: '',
      bids: [],
      biddingHistory: [],
      activities: { upcoming: [], log: [] },
      documents: [],
      estimates: [],
    }

    addOpportunity(newOpp)
    onClose()
    setForm({
      title: '',
      accountId: '',
      contactId: '',
      stage: 'Qualifying',
      amount: '',
      closeDate: '',
      projectStart: '',
      dealProbability: 20,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[480px] max-h-[90vh] overflow-y-auto z-51 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-[#2B6B52]" />
            <h2 className="font-semibold text-[#21272a]">New Opportunity</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#838383]">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g. Kitchen Remodel — Store #1842"
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#2B6B52] ${
                errors.title ? 'border-red-400' : 'border-[#dde1e6]'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Account <span className="text-red-500">*</span>
            </label>
            <select
              value={form.accountId}
              onChange={e => handleChange('accountId', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:border-[#2B6B52] bg-white ${
                errors.accountId ? 'border-red-400' : 'border-[#dde1e6]'
              }`}
            >
              <option value="">Select account</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {errors.accountId && <p className="text-xs text-red-500 mt-1">{errors.accountId}</p>}
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">Contact</label>
            <select
              value={form.contactId}
              onChange={e => handleChange('contactId', e.target.value)}
              disabled={!form.accountId}
              className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52] bg-white disabled:opacity-50"
            >
              <option value="">Select contact</option>
              {filteredContacts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.title}</option>)}
            </select>
          </div>

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-[#21272a] mb-1.5">
              Stage <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button
                  key={s}
                  onClick={() => handleChange('stage', s)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                  style={{
                    backgroundColor: form.stage === s ? STAGE_COLORS[s] : 'white',
                    color: form.stage === s ? 'white' : '#565656',
                    borderColor: form.stage === s ? STAGE_COLORS[s] : '#e5e5e5',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Probability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Amount ($)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => handleChange('amount', e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Deal Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.dealProbability}
                onChange={e => handleChange('dealProbability', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Close Date</label>
              <input
                type="date"
                value={form.closeDate}
                onChange={e => handleChange('closeDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#21272a] mb-1.5">Project Start</label>
              <input
                type="date"
                value={form.projectStart}
                onChange={e => handleChange('projectStart', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#dde1e6] text-sm focus:outline-none focus:border-[#2B6B52]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#e5e5e5] flex gap-3">
          <button
            onClick={onClose}
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
            Create Opportunity
          </button>
        </div>
      </div>
    </div>
  )
}
