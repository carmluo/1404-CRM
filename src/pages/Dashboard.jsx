import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles, ChevronDown, X, ArrowDownUp, SlidersHorizontal,
  Trash2, GripVertical, Maximize2, Plus,
} from 'lucide-react'
import { dashboardData } from '../data/mockData'
import DatePicker from '../components/ui/DatePicker'
import PhoneModal from '../components/ui/PhoneModal'
import OpportunityDrawer from '../components/ui/OpportunityDrawer'
import AccountDrawer from '../components/ui/AccountDrawer'
import Tasklist from '../components/ui/Tasklist'
import RecentOpportunities from '../components/ui/RecentOpportunities'
import AtRiskCard from '../components/ui/AtRiskCard'
import BidWonLostCard from '../components/ui/BidWonLostCard'
import TopAccountsCard from '../components/ui/TopAccountsCard'
import { useApp } from '../context/AppContext'
import { AnimatePresence } from 'framer-motion'

function formatCurrency(val) {
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`
  return `$${val.toLocaleString()}`
}

function formatCurrencyFull(val) {
  return `$${val.toLocaleString()}`
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good night'
}

const FILTER_OPTIONS = {
  department: ['All Departments', 'Sales', 'Marketing', 'Operations', 'Procurement', 'Finance'],
  region: ['All Regions', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'],
  storeType: ['All Store Types', 'GC', 'Retail', 'Online', 'Wholesale', 'Franchise'],
  rep: ['All Reps', 'Marcus Reynolds', 'Sarah Chen', 'David Park', 'Lisa Torres', 'James Wilson'],
}

const DEFAULT_MODULE_VISIBILITY = {
  pipelineByStage: true,
  overdueFollowUps: true,
  todaysTasks: true,
  bidWonLost: true,
  topAccounts: true,
  recentOpportunities: true,
  atRisk: true,
}

const MODULES_CONFIG = [
  { key: 'pipelineByStage',    label: 'Pipeline by Stage' },
  { key: 'overdueFollowUps',   label: 'Overdue Follow-ups' },
  { key: 'todaysTasks',        label: "Today's Tasks" },
  { key: 'bidWonLost',         label: 'Bid Won / Lost' },
  { key: 'topAccounts',        label: 'Top 10 Accounts' },
  { key: 'recentOpportunities',label: 'Recent Opportunities' },
  { key: 'atRisk',             label: 'At-Risk Deals' },
]

// Wraps a dashboard card in an edit-mode overlay with trash, grip, and resize controls
function Editable({ moduleKey, isEditMode, onRemove, children }) {
  if (!isEditMode) return <>{children}</>
  return (
    <div className="relative">
      {children}
      {/* frosted overlay */}
      <div
        className="absolute inset-0 rounded-card pointer-events-none"
        style={{ backgroundColor: 'rgba(255,255,255,0.70)' }}
      />
      {/* top-right controls */}
      <div className="absolute top-4 right-4 flex items-center gap-6 z-20">
        <button
          onClick={() => onRemove(moduleKey)}
          className="text-content-subtle hover:text-content transition-colors"
          title="Remove module"
        >
          <Trash2 size={20} strokeWidth={1.75} />
        </button>
        <div className="text-content-subtle cursor-grab" title="Drag to reorder">
          <GripVertical size={20} strokeWidth={1.75} />
        </div>
      </div>
      {/* bottom-right resize handle */}
      <div className="absolute bottom-4 right-4 z-20 text-content-subtle cursor-nwse-resize" title="Resize">
        <Maximize2 size={16} strokeWidth={1.75} />
      </div>
    </div>
  )
}

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const isActive = value !== options[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center font-crm transition-colors whitespace-nowrap"
        style={{
          height: 40,
          paddingLeft: 12,
          paddingRight: 10,
          paddingTop: 8,
          paddingBottom: 8,
          gap: 4,
          borderRadius: 12,
          backgroundColor: isActive ? '#2d2d2d' : 'rgba(255,255,255,0.7)',
          color: isActive ? '#f2f2f2' : '#414141',
          border: 'none',
          fontSize: 14,
          lineHeight: '21px',
          cursor: 'pointer',
        }}
      >
        {isActive ? value : label}
        <ChevronDown size={20} color={isActive ? '#f2f2f2' : '#414141'} style={{ opacity: 0.6 }} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div
            className="absolute left-0 top-full mt-1.5 z-20 rounded-[8px] overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e5e5',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              minWidth: 180,
            }}
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm font-crm transition-colors hover:bg-[#f4f4f4]"
                style={{
                  color: opt === value ? '#2B6B52' : '#232323',
                  fontWeight: opt === value ? 600 : 400,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}


export default function Dashboard() {
  const navigate = useNavigate()
  const { completedTaskIds, completeTask, saveTaskForLater, opportunities, accounts } = useApp()
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [selectedAccount, setSelectedAccount] = useState(null)

  function openAccountDrawer(accountId) {
    const acc = accounts.find(a => a.id === accountId)
    if (acc) setSelectedAccount(acc)
  }

  function openOppDrawer(id) {
    const opp = opportunities.find(o => o.id === id)
    if (opp) setSelectedOpp(opp)
  }
  const [hoveredSegment, setHoveredSegment] = useState(null)
  const [aiInsightIndex, setAiInsightIndex] = useState(0)
  const [phoneModal, setPhoneModal] = useState({ isOpen: false, contact: '', phone: '', company: '' })
  const [filters, setFilters] = useState({
    department: FILTER_OPTIONS.department[0],
    region: FILTER_OPTIONS.region[0],
    storeType: FILTER_OPTIONS.storeType[0],
    rep: 'Marcus Reynolds',  // current logged-in rep
  })
  const [isEditMode, setIsEditMode] = useState(false)
  const [moduleVisibility, setModuleVisibility] = useState(DEFAULT_MODULE_VISIBILITY)

  function removeModule(key) {
    setModuleVisibility(prev => ({ ...prev, [key]: false }))
  }

  function addModule(key) {
    setModuleVisibility(prev => ({ ...prev, [key]: true }))
  }

  // Rep is always "set" so don't count it as an active filter for clear-all purposes
  const activeFilterCount = Object.entries(filters).filter(
    ([key, val]) => key !== 'rep' && val !== FILTER_OPTIONS[key][0]
  ).length

  function setFilter(key, val) {
    setFilters(f => ({ ...f, [key]: val }))
  }

  function clearFilters() {
    setFilters({
      department: FILTER_OPTIONS.department[0],
      region: FILTER_OPTIONS.region[0],
      storeType: FILTER_OPTIONS.storeType[0],
      rep: FILTER_OPTIONS.rep[0],
    })
  }

  // Rotate AI insights
  useEffect(() => {
    const interval = setInterval(() => {
      setAiInsightIndex(i => (i + 1) % dashboardData.aiInsights.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const { pipelineStats, stageBreakdown, overdueFollowUps, todaysTasks,
    bidWonLostRatio, top10Accounts, recentOpportunitiesCreated,
    recentOpportunitiesUpdated, atRisk, aiInsights } = dashboardData

  const segmentStats = hoveredSegment !== null
    ? { value: stageBreakdown[hoveredSegment].value, count: stageBreakdown[hoveredSegment].count, label: stageBreakdown[hoveredSegment].stage }
    : null

  return (
    <div className="flex flex-col gap-5">
      {/* Header — Figma node 1001:4431 */}
      <div className="flex items-center justify-between">
        {/* Left: greeting (default) or edit-mode title */}
        <div className="flex items-center" style={{ gap: 12 }}>
          {isEditMode ? (
            <h1
              className="font-crm whitespace-nowrap"
              style={{ fontSize: 34, lineHeight: '44.2px', fontWeight: 500, color: '#21272a' }}
            >
              Editing layout
            </h1>
          ) : (
            <>
              <h1
                className="font-crm whitespace-nowrap"
                style={{ fontSize: 34, lineHeight: '44.2px', fontWeight: 500, color: '#21272a' }}
              >
                {getGreeting()}, Marcus
              </h1>
              <FilterDropdown
                label="Rep"
                options={FILTER_OPTIONS.rep.filter(r => r !== 'All Reps')}
                value={filters.rep}
                onChange={val => setFilter('rep', val)}
              />
            </>
          )}
        </div>

        {/* Right: filters + date picker */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <FilterDropdown
            label="Department"
            options={FILTER_OPTIONS.department}
            value={filters.department}
            onChange={val => setFilter('department', val)}
          />
          <FilterDropdown
            label="Region"
            options={FILTER_OPTIONS.region}
            value={filters.region}
            onChange={val => setFilter('region', val)}
          />
          <FilterDropdown
            label="Store type"
            options={FILTER_OPTIONS.storeType}
            value={filters.storeType}
            onChange={val => setFilter('storeType', val)}
          />
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 font-crm transition-colors"
              style={{ fontSize: 14, color: '#838383', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={14} />
              Clear
            </button>
          )}
          <DatePicker />
          <button
            onClick={() => setIsEditMode(m => !m)}
            className="flex items-center justify-center rounded-xl transition-colors"
            title={isEditMode ? 'Done editing' : 'Customize layout'}
            style={{
              width: 40,
              height: 40,
              backgroundColor: isEditMode ? '#2D2D2D' : 'rgba(255,255,255,0.7)',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.18s ease',
            }}
          >
            <SlidersHorizontal
              size={20}
              strokeWidth={1.75}
              color={isEditMode ? '#F2F2F2' : '#414141'}
            />
          </button>
        </div>
      </div>

      {/* Pipeline by Stage — Figma node 362:13409 */}
      {moduleVisibility.pipelineByStage && (
      <Editable moduleKey="pipelineByStage" isEditMode={isEditMode} onRemove={removeModule}>
      <div className="bg-white rounded-card p-4 flex flex-col gap-4">
        {/* Title */}
        <p className="font-crm font-bold text-body-2 text-content whitespace-nowrap">
          Pipeline by stage
        </p>

        {/* AI Insight */}
        <div className="flex items-center gap-2 p-2">
          <Sparkles size={24} strokeWidth={1.75} className="shrink-0 text-content-subtlest" />
          <span className="font-crm text-body-2 text-content-subtlest whitespace-nowrap">
            {aiInsights[aiInsightIndex]}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-start gap-8">
          {segmentStats ? (
            <>
              <div className="flex flex-col items-start justify-center">
                <p className="font-crm text-body-3 text-content">Value</p>
                <p className="font-crm font-bold text-h6 text-content whitespace-nowrap">{formatCurrencyFull(segmentStats.value)}</p>
              </div>
              <div className="flex flex-col items-start justify-center">
                <p className="font-crm text-body-3 text-content">Active Deals</p>
                <p className="font-crm font-bold text-h6 text-content whitespace-nowrap">{segmentStats.count}</p>
              </div>
              <div className="flex flex-col items-start justify-center whitespace-nowrap">
                <p className="font-crm text-body-3 text-content">Stage</p>
                <p className="font-crm font-bold text-h6 text-content">{segmentStats.label}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-start justify-center">
                <p className="font-crm text-body-3 text-content">Pipeline Value</p>
                <p className="font-crm font-bold text-h6 text-content whitespace-nowrap">{formatCurrencyFull(pipelineStats.totalValue)}</p>
              </div>
              <div className="flex flex-col items-start justify-center">
                <p className="font-crm text-body-3 text-content">Average Deal</p>
                <p className="font-crm font-bold text-h6 text-content whitespace-nowrap">{formatCurrencyFull(pipelineStats.averageDeal)}</p>
              </div>
              <div className="flex flex-col items-start justify-center whitespace-nowrap">
                <p className="font-crm text-body-3 text-content">Active Deals</p>
                <p className="font-crm font-bold text-h6 text-content">{pipelineStats.activeDeals}</p>
              </div>
            </>
          )}
        </div>

        {/* Segmented bar — h-[40px], rounded-[4px], border on each segment */}
        <div className="flex h-[40px] w-full">
          {stageBreakdown.map((seg, i) => (
            <div
              key={seg.stage}
              className="cursor-pointer transition-opacity duration-150 rounded-[4px] border border-border"
              style={{
                width: `${seg.percentage}%`,
                backgroundColor: seg.color,
                opacity: hoveredSegment !== null && hoveredSegment !== i ? 0.3 : 1,
                minWidth: 4,
              }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => navigate(`/opportunities?stage=${encodeURIComponent(seg.stage)}`)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between">
          {stageBreakdown.map((seg, i) => (
            <button
              key={seg.stage}
              className="flex items-center gap-1 font-crm text-body-2 whitespace-nowrap transition-colors duration-150 cursor-pointer"
              style={{ color: hoveredSegment === null || hoveredSegment === i ? '#232323' : '#838383' }}
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={() => navigate(`/opportunities?stage=${encodeURIComponent(seg.stage)}`)}
            >
              <span className="rounded-full shrink-0 w-4 h-4" style={{ backgroundColor: seg.color }} />
              {seg.stage}
            </button>
          ))}
        </div>
      </div>
      </Editable>
      )}

      {/* Two-column grid — 3 rows × 2 cols, equal row heights via CSS grid stretch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Row 1, col 1 — Overdue Follow-ups — Figma node 1001:4440 */}
          {moduleVisibility.overdueFollowUps && (
          <Editable moduleKey="overdueFollowUps" isEditMode={isEditMode} onRemove={removeModule}>
          <div
            className="rounded-[8px] flex flex-col"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)', padding: 16, gap: 16 }}
          >
            {/* Header */}
            <div className="flex items-center shrink-0 w-full" style={{ gap: 12 }}>
              <p className="font-crm font-bold whitespace-nowrap shrink-0" style={{ fontSize: 18, lineHeight: 'normal', color: '#232323' }}>
                Overdue follow-ups
              </p>
              <div
                className="flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#cfe8e0', paddingLeft: 12, paddingRight: 12, borderRadius: 12 }}
              >
                <span className="font-crm" style={{ fontSize: 14, lineHeight: '21px', color: '#326757' }}>
                  {overdueFollowUps.length}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-[8px] w-full" style={{ backgroundColor: '#F2F2F2', paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
              <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                  <col />
                  <col style={{ width: 100 }} />
                  <col style={{ width: 95 }} />
                  <col style={{ width: 85 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-left" style={{ paddingLeft: 16, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                      <span className="font-crm font-medium uppercase" style={{ fontSize: 12, lineHeight: 1, color: '#838383' }}>Opportunity</span>
                    </th>
                    <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                      <span className="font-crm font-medium uppercase" style={{ fontSize: 12, lineHeight: 1, color: '#838383' }}>Contact</span>
                    </th>
                    <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                      <span className="font-crm font-medium uppercase inline-flex items-center" style={{ fontSize: 12, lineHeight: 1, color: '#838383', gap: 4 }}>
                        <ArrowDownUp size={14} />
                        Overdue
                      </span>
                    </th>
                    <th className="text-left" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 10, paddingBottom: 10, borderBottom: '1px solid #e5e5e5', verticalAlign: 'bottom' }}>
                      <span className="font-crm font-medium uppercase inline-flex items-center" style={{ fontSize: 12, lineHeight: 1, color: '#838383', gap: 4 }}>
                        <ArrowDownUp size={14} />
                        Amount
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {overdueFollowUps.map((item, i) => (
                    <tr
                      key={item.id}
                      className="cursor-pointer"
                      style={{ borderBottom: i < overdueFollowUps.length - 1 ? '1px solid #e5e5e5' : 'none' }}
                      onClick={() => openOppDrawer(item.id)}
                    >
                      <td style={{ paddingLeft: 16, paddingRight: 8, paddingTop: 12, paddingBottom: 12 }}>
                        <span className="font-crm block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}>
                          {item.opportunity}
                        </span>
                      </td>
                      <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12 }}>
                        <span className="font-crm block overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}>
                          {item.contact}
                        </span>
                      </td>
                      <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12, whiteSpace: 'nowrap' }}>
                        <span className="font-crm font-bold" style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}>
                          {item.overdue}
                        </span>
                      </td>
                      <td style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 12, paddingBottom: 12, whiteSpace: 'nowrap' }}>
                        <span className="font-crm" style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}>
                          {formatCurrency(item.amount)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </Editable>
          )}

          {/* Row 1, col 2 — Today's Tasks — Figma node 1001:4445 */}
          {moduleVisibility.todaysTasks && (
          <Editable moduleKey="todaysTasks" isEditMode={isEditMode} onRemove={removeModule}>
          <Tasklist
            tasks={todaysTasks}
            completedTaskIds={completedTaskIds}
            onComplete={completeTask}
            onSaveLater={saveTaskForLater}
            onPhone={task => setPhoneModal({ isOpen: true, contact: task.contact, phone: task.phone, company: task.account })}
            onEmail={task => window.location.href = `mailto:${task.email}`}
            onNavigate={task => navigate(`/opportunities/${task.opportunityId}`)}
          />
          </Editable>
          )}

          {/* Row 2, col 1 — Bid Won/Lost Ratio — Figma node 1001:4459 */}
          {moduleVisibility.bidWonLost && (
          <Editable moduleKey="bidWonLost" isEditMode={isEditMode} onRemove={removeModule}>
          <BidWonLostCard data={bidWonLostRatio} />
          </Editable>
          )}

          {/* Row 2, col 2 — Top 10 Accounts — Figma node 1001:4460 */}
          {moduleVisibility.topAccounts && (
          <Editable moduleKey="topAccounts" isEditMode={isEditMode} onRemove={removeModule}>
          <TopAccountsCard accounts={top10Accounts} onAccountClick={openAccountDrawer} />
          </Editable>
          )}

          {/* Row 3, col 1 — Recent Opportunities — Figma node 519:75735 */}
          {moduleVisibility.recentOpportunities && (
          <Editable moduleKey="recentOpportunities" isEditMode={isEditMode} onRemove={removeModule}>
          <RecentOpportunities
            created={recentOpportunitiesCreated}
            updated={recentOpportunitiesUpdated}
            onRowClick={openOppDrawer}
          />
          </Editable>
          )}

          {/* Row 3, col 2 — At-Risk — Figma node 1001:4463 */}
          {moduleVisibility.atRisk && (
          <Editable moduleKey="atRisk" isEditMode={isEditMode} onRemove={removeModule}>
          <AtRiskCard
            items={atRisk}
            onRowClick={openOppDrawer}
          />
          </Editable>
          )}
      </div>

      {/* Add module — Figma node 1477:15463, visible only in edit mode */}
      {isEditMode && (() => {
        const hidden = MODULES_CONFIG.filter(m => !moduleVisibility[m.key])
        return (
          <div
            className="rounded-card flex flex-col items-center justify-center gap-3"
            style={{
              minHeight: 120,
              border: '2px dashed #CBCBCB',
              backgroundColor: 'transparent',
            }}
          >
            <div className="flex items-center gap-2 text-content-subtle">
              <Plus size={16} strokeWidth={1.75} />
              <span className="font-crm font-medium text-body-3">Add module</span>
            </div>
            {hidden.length > 0 ? (
              <div className="flex items-center gap-2 flex-wrap justify-center px-4">
                {hidden.map(m => (
                  <button
                    key={m.key}
                    onClick={() => addModule(m.key)}
                    className="font-crm text-body-3 text-content-primary hover:text-content-primary-bold transition-colors px-3 py-1 rounded-xl hover:bg-brand"
                    style={{ fontSize: 13, border: '1px solid #92C9B9' }}
                  >
                    + {m.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="font-crm text-body-3 text-content-disabled">All modules visible</p>
            )}
          </div>
        )
      })()}

      <PhoneModal
        isOpen={phoneModal.isOpen}
        onClose={() => setPhoneModal({ isOpen: false, contact: '', phone: '', company: '' })}
        contact={phoneModal.contact}
        phone={phoneModal.phone}
        company={phoneModal.company}
      />

      <AnimatePresence>
        {selectedOpp && (
          <OpportunityDrawer
            opp={selectedOpp}
            onClose={() => setSelectedOpp(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAccount && (
          <AccountDrawer
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
            onViewDetail={acc => { navigate(`/accounts/${acc.id}`); setSelectedAccount(null) }}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
