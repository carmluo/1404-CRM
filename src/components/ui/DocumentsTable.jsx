// Figma node 1026:7967
// Row layout: flex px-[16px] py-[8px] border-b border-border gap-[8px] items-center
// Header labels: font-crm text-body-3 text-content uppercase tracking-wide
// Document link: flex-1 min-w-[180px] font-crm text-body-2 text-content-subtle underline [text-decoration-skip-ink:none]
// Source:        flex-1 max-w-[180px] font-crm text-body-2 text-content-subtle
// Date:          w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap
import { format, parseISO } from 'date-fns'

function Row({ document: doc }) {
  return (
    <div className="flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border last:border-0">
      <a
        href="#"
        className="flex-1 min-w-[180px] font-crm text-body-2 text-content-subtle underline [text-decoration-skip-ink:none] truncate"
      >
        {doc.name}
      </a>
      <p className="flex-1 max-w-[180px] min-w-0 font-crm text-body-2 text-content-subtle truncate">
        {doc.source}
      </p>
      <p className="w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap">
        {format(parseISO(doc.date), 'MMM d, yyyy')}
      </p>
    </div>
  )
}

export default function DocumentsTable({ documents = [] }) {
  return (
    <div className="w-full border border-border rounded-card overflow-hidden bg-surface-elevated">
      {/* Header */}
      <div className="flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border">
        <p className="flex-1 min-w-[180px] font-crm text-body-3 text-content uppercase tracking-wide">Document</p>
        <p className="flex-1 max-w-[180px] min-w-0 font-crm text-body-3 text-content uppercase tracking-wide">Source</p>
        <p className="w-[110px] shrink-0 font-crm text-body-3 text-content uppercase tracking-wide">Date</p>
      </div>

      {/* Rows */}
      {documents.length === 0 ? (
        <p className="px-[16px] py-[12px] font-crm text-body-3 text-content-disabled">No documents attached.</p>
      ) : (
        documents.map((doc, i) => <Row key={i} document={doc} />)
      )}
    </div>
  )
}
