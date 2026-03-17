import React from 'react'
import { FileText, Pin, Plus } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function sortNotes(notes) {
  const pinned = [...notes.filter(n => n.pinned)].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const unpinned = [...notes.filter(n => !n.pinned)].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return [...pinned, ...unpinned]
}

export default function NotesFeed({ notes, onAddNote, onTogglePin }) {
  const { opportunities } = useApp()
  const sorted = sortNotes(notes || [])

  function resolveOppTitle(linkedOppId) {
    return opportunities.find(o => o.id === linkedOppId)?.title ?? linkedOppId
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <FileText size={28} className="text-content-disabled" />
          <p className="font-crm text-body-3 font-bold text-content-disabled">No notes yet</p>
          <p className="font-crm text-body-3 text-content-disabled">Add a note to track important details</p>
        </div>
        <button
          onClick={onAddNote}
          className="flex items-center gap-1.5 font-crm text-body-3 text-content-subtlest hover:text-content transition-colors"
        >
          <Plus size={13} />
          Add note
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {sorted.map(note => (
        <div key={note.id} className="flex flex-col gap-1.5 py-3 border-b border-border last:border-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Type badge */}
              <span className="font-crm text-body-3 bg-surface border border-border rounded-full px-2 py-0.5 text-content-subtlest text-[11px]">
                {note.type === 'call_meeting' ? 'Call / Meeting' : 'Internal'}
              </span>
              {/* Linked entity chips */}
              {note.linkedOppId && (
                <span className="font-crm text-[11px] text-content-subtlest bg-surface-elevated border border-border rounded-full px-2 py-0.5">
                  {resolveOppTitle(note.linkedOppId)}
                </span>
              )}
              {note.linkedAccountId && (
                <span className="font-crm text-[11px] text-content-subtlest bg-surface-elevated border border-border rounded-full px-2 py-0.5">
                  {note.linkedAccountId}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Pin button */}
              <button
                onClick={() => onTogglePin(note.id)}
                className={`p-1 rounded-card transition-colors ${
                  note.pinned ? 'text-content-primary' : 'text-content-disabled hover:text-content'
                }`}
                title={note.pinned ? 'Unpin' : 'Pin to top'}
              >
                <Pin size={13} fill={note.pinned ? 'currentColor' : 'none'} />
              </button>
              {/* Date */}
              <span className="font-crm text-body-3 text-content-disabled">{formatDate(note.createdAt)}</span>
            </div>
          </div>
          {/* Body */}
          <p className="font-crm text-body-3 text-content whitespace-pre-wrap">{note.body}</p>
        </div>
      ))}

      {/* Add note footer */}
      <button
        onClick={onAddNote}
        className="mt-3 flex items-center gap-1.5 font-crm text-body-3 text-content-subtlest hover:text-content transition-colors"
      >
        <Plus size={13} />
        Add note
      </button>
    </div>
  )
}
