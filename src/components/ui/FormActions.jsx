/**
 * FormActions — Figma node 1091:68176
 *
 * Cancel + Save button pair for inline edit forms.
 *   container: flex gap-[4px]
 *   both buttons: h-[40px] rounded-[12px] px-[12px] py-[8px] flex-1
 *   Cancel: no bg, text-content-primary (#326757)
 *   Save:   bg-brand-action, text-content-invert (#F2F2F2)
 */
export default function FormActions({ onSave, onCancel, saveLabel = 'Save', cancelLabel = 'Cancel' }) {
  return (
    <div className="flex gap-[4px] items-center">
      <button
        onClick={onCancel}
        className="flex flex-1 h-[40px] items-center justify-center px-[12px] py-[8px] rounded-[12px] font-crm text-body-3 font-bold text-content-primary whitespace-nowrap hover:bg-surface-hover transition-colors"
      >
        {cancelLabel}
      </button>
      <button
        onClick={onSave}
        className="flex flex-1 h-[40px] items-center justify-center px-[12px] py-[8px] rounded-[12px] font-crm text-body-3 font-bold bg-brand-action text-content-invert whitespace-nowrap hover:opacity-90 transition-opacity"
      >
        {saveLabel}
      </button>
    </div>
  )
}
