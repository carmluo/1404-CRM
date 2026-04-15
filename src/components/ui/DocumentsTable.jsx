// Figma node 1478:15454
// Row: flex relative px-[16px] py-[8px] border-b border-border gap-[8px] items-center group
// On hover: pin + trash icons appear (opacity-0 → opacity-100), date fades out
// Header labels: font-crm text-body-3 text-content uppercase tracking-wide
// Document link: flex-1 min-w-[180px] font-crm text-body-2 text-content-subtle underline
// Source:        flex-1 max-w-[180px] font-crm text-body-2 text-content-subtle
// Date:          w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap
import { Pin, Trash2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'

function Row({ document: doc, onDelete }) {
  return (
    <div className="relative flex items-center gap-[8px] px-[16px] py-[8px] border-b border-border last:border-0 group">
      <a
        href="#"
        className="flex-1 min-w-[180px] font-crm text-body-2 text-content-subtle underline [text-decoration-skip-ink:none] truncate"
      >
        {doc.name}
      </a>
      <p className="flex-1 max-w-[180px] min-w-0 font-crm text-body-2 text-content-subtle truncate">
        {doc.source}
      </p>
      <p className="w-[110px] shrink-0 font-crm text-body-2 text-content-subtle whitespace-nowrap transition-opacity group-hover:opacity-0">
        {format(parseISO(doc.date), 'MMM d, yyyy')}
      </p>

      {/* Hover actions */}
      <div className="absolute right-[16px] top-1/2 -translate-y-1/2 flex items-center gap-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          className="text-content-disabled hover:text-content-primary transition-colors"
          title="Pin document"
        >
          <Pin size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete?.(doc.name)}
          className="text-content-disabled hover:text-danger-text transition-colors"
          title="Delete document"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

export default function DocumentsTable({ documents = [], onDelete }) {
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
        documents.map((doc, i) => (
          <Row key={i} document={doc} onDelete={onDelete} />
        ))
      )}
    </div>
  )
}
