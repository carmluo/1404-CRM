import React from 'react'
import { Sparkles } from 'lucide-react'

const stageStyles = {
  qualifying: { bg: '#EBF9F5', text: '#5BBFA0', border: '#5BBFA0' },
  needsAnalysis: { bg: '#F5EDFB', text: '#9C59C5', border: '#9C59C5' },
  estPrep: { bg: '#EBF3FD', text: '#4A8FE0', border: '#4A8FE0' },
  estSubmitted: { bg: '#FEF6E7', text: '#F5A623', border: '#F5A623' },
  negotiation: { bg: '#F3F6E8', text: '#8A9D35', border: '#8A9D35' },
  verbalCommit: { bg: '#F0ECFA', text: '#7B5EA7', border: '#7B5EA7' },
}

const statusStyles = {
  won: { bg: '#DCFCE7', text: '#16A34A' },
  lost: { bg: '#FEE2E2', text: '#DC2626' },
  pending: { bg: '#FFF5D8', text: '#F16300' },
  accepted: { bg: '#EBFFD2', text: '#528002' },
  drafted: { bg: '#F2F2F2', text: '#414141' },
  sent: { bg: '#EBF3FD', text: '#4A8FE0' },
  active: { bg: '#EBFFD2', text: '#528002' },
  inactive: { bg: '#F2F2F2', text: '#414141' },
}

const riskStyles = {
  noActivity: { bg: '#F3F4F6', text: '#9CA3AF' },
  unresolved: { bg: '#FEF3C7', text: '#D97706' },
  overdue: { bg: '#FEE2E2', text: '#EF4444' },
  overdueFollowUp: { bg: '#FEE2E2', text: '#EF4444' },
}

const engagementStyles = {
  Responsive: { bg: '#DCFCE7', text: '#16A34A' },
  Moderate: { bg: '#FEF3C7', text: '#D97706' },
  Weak: { bg: '#F3F4F6', text: '#9CA3AF' },
}

const stageNameMap = {
  'Qualifying': 'qualifying',
  'Needs Analysis': 'needsAnalysis',
  'Estimate Prep': 'estPrep',
  'Estimate Submitted': 'estSubmitted',
  'Negotiation': 'negotiation',
  'Verbal Commit': 'verbalCommit',
}

export default function Badge({ variant, value, label, className = '' }) {
  let style = {}
  let displayLabel = label || value

  if (variant === 'stage') {
    const key = stageNameMap[value] || value
    const s = stageStyles[key] || stageStyles.qualifying
    style = { backgroundColor: s.bg, color: s.text }
  } else if (variant === 'status') {
    const key = (value || '').toLowerCase()
    const s = statusStyles[key] || statusStyles.drafted
    style = { backgroundColor: s.bg, color: s.text }
  } else if (variant === 'risk') {
    const s = riskStyles[value] || riskStyles.noActivity
    style = { backgroundColor: s.bg, color: s.text }
    if (!displayLabel) {
      if (value === 'noActivity') displayLabel = 'No activity'
      else if (value === 'unresolved') displayLabel = 'Unresolved question'
      else if (value === 'overdue' || value === 'overdueFollowUp') displayLabel = 'Overdue follow-up'
    }
  } else if (variant === 'engagement') {
    const s = engagementStyles[value] || engagementStyles.Weak
    style = { backgroundColor: s.bg, color: s.text }
    displayLabel = value
  } else if (variant === 'ai') {
    style = { backgroundColor: '#E8F5F0', color: '#2B6B52' }
  }

  if (variant === 'ai') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${className}`}
        style={{ ...style, borderRadius: 4 }}
      >
        <Sparkles size={10} />
        {displayLabel || 'AI Suggested'}
      </span>
    )
  }

  const radius = variant === 'status' ? 100 : 4

  return (
    <span
      className={`inline-flex items-center px-[10px] py-[4px] font-crm text-body-3 font-bold whitespace-nowrap ${className}`}
      style={{ ...style, borderRadius: radius }}
    >
      {displayLabel}
    </span>
  )
}
