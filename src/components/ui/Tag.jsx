import { X } from 'lucide-react'

// Figma node 1055:29459
// 3 states: selected, unselected, filter-applied
// All: pl-[10px] pr-[12px] py-[4px], rounded-[100px], Body/B3 14px/21px
// selected:       bg #438974, text #f2f2f2, no border
// unselected:     border #e5e5e5, text #565656, no bg
// filter-applied: border #e5e5e5, text #565656, gap-[4px], X icon 14px left of label

export default function Tag({ label, state = 'unselected', onClick }) {
  const isSelected = state === 'selected'
  const isFilterApplied = state === 'filter-applied'

  return (
    <button
      onClick={onClick}
      className="flex items-center font-crm whitespace-nowrap transition-colors duration-150"
      style={{
        paddingLeft: 10,
        paddingRight: 12,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 100,
        gap: isFilterApplied ? 4 : 0,
        backgroundColor: isSelected ? '#438974' : 'transparent',
        border: isSelected ? 'none' : '1px solid #e5e5e5',
        color: isSelected ? '#f2f2f2' : '#565656',
        fontSize: 14,
        lineHeight: '21px',
        cursor: 'pointer',
      }}
    >
      {isFilterApplied && <X size={14} strokeWidth={1.75} />}
      {label}
    </button>
  )
}
