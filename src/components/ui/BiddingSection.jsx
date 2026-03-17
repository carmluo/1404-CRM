import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import BiddingTable from './BiddingTable'
import BiddingHistory from './BiddingHistory'

// Figma node 1026:9840
// Single card combining BiddingTable + BiddingHistory with company selector
// Card: bg-surface-elevated border-border rounded-card overflow-hidden px-5 py-4 gap-3
// Section titles: font-crm text-body-2 font-bold text-content (Label/L1)
// Company dropdown: bg-brand rounded-card px-3 py-[4px] gap-[5px] text-content-primary

export default function BiddingSection({ bids = [], biddingHistory = [] }) {
  const [selectedCompany, setSelectedCompany] = useState(
    biddingHistory[0]?.company ?? ''
  )

  const selectedYears = biddingHistory.find(b => b.company === selectedCompany)?.years ?? []

  return (
    <div className="bg-surface-elevated border-border rounded-card overflow-hidden px-5 py-4 flex flex-col gap-3">

      {/* Bidding table section */}
      <div className="flex items-center justify-start py-[4px]">
        <h3 className="font-crm text-body-2 font-bold text-content">Bidding</h3>
      </div>

      <BiddingTable bids={bids} />

      {/* Bidding History section — only if history exists */}
      {biddingHistory.length > 0 && (
        <>
          {/* History header row */}
          <div className="flex items-center gap-3">
            <h3 className="font-crm text-body-2 font-bold text-content whitespace-nowrap">
              Bidding History
            </h3>

            {/* Company selector dropdown */}
            {biddingHistory.length > 1 ? (
              <div className="relative">
                <select
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                  className="appearance-none bg-brand text-content-primary font-crm text-body-3 rounded-card px-3 py-[4px] pr-7 cursor-pointer focus:outline-none"
                >
                  {biddingHistory.map(b => (
                    <option key={b.company} value={b.company}>{b.company}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-content-primary"
                  strokeWidth={2}
                />
              </div>
            ) : (
              <span className="inline-flex items-center gap-[5px] bg-brand text-content-primary font-crm text-body-3 rounded-card px-3 py-[4px]">
                {biddingHistory[0]?.company}
                <ChevronDown size={14} strokeWidth={2} />
              </span>
            )}
          </div>

          <BiddingHistory years={selectedYears} />
        </>
      )}
    </div>
  )
}
