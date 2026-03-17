// Figma node 1279:84899
// Container: flex gap-[14px] items-start px-[16px]
// Input: flex-1 h-[40px] border-border-primary-bold rounded-card px-[12px] py-[10px]
//        font-crm text-body-3 text-content, placeholder text-content-disabled
// Button: h-[40px] w-[67px] bg-brand-action rounded-xl px-[12px] py-[8px]
//         font-crm text-body-3 font-bold text-content-invert

export default function AddTask({
  value = '',
  onChange,
  onAdd,
  placeholder = 'Add new task',
}) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onAdd?.()
  }

  return (
    <div className="flex gap-[14px] items-start px-[16px]">
      <input
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          flex-1 h-[40px] min-w-0
          border border-border-primary-bold rounded-card
          px-[12px] py-[10px]
          font-crm text-body-3 text-content
          placeholder:text-content-disabled
          focus:outline-none
          bg-transparent
        "
      />
      <button
        onClick={() => onAdd?.()}
        className="
          h-[40px] w-[67px] shrink-0
          bg-brand-action rounded-xl
          px-[12px] py-[8px]
          font-crm text-body-3 font-bold text-content-invert
        "
      >
        Add
      </button>
    </div>
  )
}
