import { FilePen, Pin, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'

// Figma node 1478:10697 — notes card
// Container: bg-surface-elevated rounded-card overflow-hidden pt-[16px] px-[20px] pb-[8px] gap-[8px]
// Header: flex items-center justify-center py-[4px], body-2 bold text-content
// Note row: flex flex-col gap-[7px] py-[4px]
//   top: flex justify-between — type (bold body-3) + date (regular body-3), color text-content-subtle, gap-[10px]
//           pin icon size-[20px] right
//   body: body-3 text-content-subtle
// Divider: w-full border-t border-border
// Add note btn: flex gap-[8px] pl-[10px] pr-[12px] py-[8px] rounded-[12px], Plus size 24, text-content-subtlest

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function noteTypeLabel(type) {
  if (type === 'call_meeting') return 'Meeting'
  if (type === 'internal') return 'Internal'
  return type ?? 'Note'
}

function sortNotes(notes) {
  const pinned = [...notes.filter(n => n.pinned)].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const unpinned = [...notes.filter(n => !n.pinned)].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return [...pinned, ...unpinned]
}

export default function NotesFeed({ notes, onAddNote, onTogglePin }) {
  const { opportunities } = useApp()
  const sorted = sortNotes(notes || [])

  return (
    <div className="bg-surface-elevated rounded-card overflow-hidden flex flex-col gap-2 pt-4 px-5 pb-2 w-full">

      {/* Header */}
      <div className="flex items-center justify-start py-1 shrink-0">
        <p className="font-crm text-body-2 font-bold text-content whitespace-nowrap">Notes</p>
      </div>

      {/* Empty state — Figma node 1513:37422 */}
      {sorted.length === 0 && (
        <button
          type="button"
          onClick={onAddNote}
          className="w-full flex items-center gap-[16px] justify-center px-[16px] py-[12px] border border-dashed border-border rounded-card hover:border-border-hover hover:bg-surface transition-colors"
        >
          <FilePen size={32} className="text-content-subtlest shrink-0" />
          <div className="flex flex-col gap-[4px] items-start">
            <p className="font-crm text-body-3 font-bold text-content-subtlest whitespace-nowrap">No notes yet</p>
            <p className="font-crm text-[12px] font-medium text-content-subtlest whitespace-nowrap">Click to add a note to track important details</p>
          </div>
        </button>
      )}

      {/* Note rows */}
      {sorted.map(note => (
        <div key={note.id} className="flex flex-col gap-[7px] py-1">
          {/* Top: type + date | pin */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-[10px] text-content-subtle">
              <span className="font-crm text-body-3 font-bold leading-[21px]">
                {noteTypeLabel(note.type)}
              </span>
              <span className="font-crm text-body-3 leading-[21px]">
                {formatDate(note.createdAt)}
              </span>
            </div>
            <button
              onClick={() => onTogglePin(note.id)}
              className="shrink-0 transition-colors"
              title={note.pinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin
                size={20}
                className={note.pinned ? 'text-content-subtle' : 'text-content-disabled hover:text-content-subtle'}
                fill={note.pinned ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          {/* Body */}
          <p className="font-crm text-body-3 text-content-subtle leading-[21px] whitespace-pre-wrap">
            {note.body}
          </p>
        </div>
      ))}

      {/* Divider + Add note button — hidden when empty state is shown */}
      {sorted.length > 0 && (
        <>
          <div className="w-full border-t border-border shrink-0" />
          <button
            onClick={onAddNote}
            className="flex items-center gap-2 pl-[10px] pr-3 py-2 rounded-xl text-content-subtlest hover:bg-surface transition-colors"
          >
            <Plus size={24} className="shrink-0" />
            <span className="font-crm text-body-3 whitespace-nowrap">Add note</span>
          </button>
        </>
      )}

    </div>
  )
}
