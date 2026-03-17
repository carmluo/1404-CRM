import { Fragment } from 'react'

// Figma node 1068:52629
// 4-column grid: Company | Contact | Current bid | Status
// grid-cols-[fit-content(100%) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)] gap-x-[16px] gap-y-[7px] px-[12px] rounded-[8px]
// Headers: text-body-3 text-content-subtlest (#4D5358)
// Cells: text-body-3 text-content
// Status tags: rounded-[100px] pl-[10px] pr-[12px] py-[4px] font-bold

function formatCurrency(val) {
  if (!val) return '$0'
  return `$${val.toLocaleString()}`
}

function StatusTag({ status }) {
  const styles = {
    accepted: 'bg-safe text-safe-text',
    pending:  'bg-warning text-warning-text',
    lost:     'bg-danger text-danger-text',
  }
  const style = styles[status?.toLowerCase()] ?? 'bg-surface text-content'

  return (
    <span className={`inline-flex items-center font-crm text-body-3 font-bold pl-[10px] pr-[12px] py-[4px] rounded-[100px] whitespace-nowrap ${style}`}>
      {status}
    </span>
  )
}

export default function BiddingTable({ bids = [] }) {
  if (!bids.length) {
    return <p className="font-crm text-body-3 text-content-disabled">No bids yet.</p>
  }

  return (
    <div className="grid grid-cols-[fit-content(100%)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-[16px] gap-y-[7px] px-[12px] rounded-[8px]">
      {/* Column headers */}
      <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Company</span>
      <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Contact</span>
      <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Current bid</span>
      <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">Status</span>

      {/* Data rows */}
      {bids.map((bid, i) => (
        <Fragment key={i}>
          <div className="font-crm text-body-3 text-content overflow-hidden text-ellipsis whitespace-nowrap">
            {bid.company}
          </div>
          <div className="font-crm text-body-3 text-content">
            {bid.contact}
          </div>
          <div className="font-crm text-body-3 text-content">
            {formatCurrency(bid.currentBid)}
          </div>
          <div>
            <StatusTag status={bid.status} />
          </div>
        </Fragment>
      ))}
    </div>
  )
}
