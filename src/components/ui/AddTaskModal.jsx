import { useState } from 'react'
import { CalendarDays } from 'lucide-react'

// Figma node 1480:36438 — modal-addTask
export default function AddTaskModal({ onClose, onSave }) {
  const [taskText, setTaskText] = useState('')

  function handleSave() {
    if (!taskText.trim()) return
    onSave?.({ task: taskText.trim() })
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-50"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="fixed z-50 bg-surface-white rounded-2xl shadow-2xl"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Heading */}
        <h2 className="font-crm text-h6 font-bold text-content leading-[29px]">
          Add task
        </h2>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={taskText}
            onChange={e => setTaskText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Schedule a meeting with @Contact"
            autoFocus
            className="w-full font-crm text-body-3 text-content bg-surface-white rounded-card pr-10 outline-none"
            style={{
              border: '1px solid #326757',
              padding: '10px 40px 10px 14px',
              lineHeight: '21px',
            }}
          />
          <CalendarDays
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-primary pointer-events-none"
            strokeWidth={1.75}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="font-crm text-body-3 font-bold text-content-primary rounded-xl transition-colors hover:bg-brand"
            style={{ padding: '8px 16px', border: '1px solid #326757' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!taskText.trim()}
            className="font-crm text-body-3 font-bold text-content-invert rounded-xl transition-colors"
            style={{
              padding: '8px 16px',
              backgroundColor: taskText.trim() ? '#326757' : '#B3B3B3',
              border: 'none',
              cursor: taskText.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  )
}
