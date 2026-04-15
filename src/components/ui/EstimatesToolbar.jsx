// Figma node 1478:11823 — estimates tab action bar
// Container: flex items-center justify-between w-full
// Create btn: bg-surface-white border border-border gap-[8px] pl-[10px] pr-[12px] py-[8px] rounded-[12px]
//             lucide/plus size-[24px], Body/B3 regular text-content-subtle
// Sort btn:   no bg/border gap-[8px] pl-[10px] pr-[12px] py-[8px] rounded-[12px]
//             lucide/arrow-up-down size-[24px], Body/B3 bold text-content

import { Plus, ArrowUpDown } from 'lucide-react'

export default function EstimatesToolbar({ onCreateNew, onSort }) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Create new estimate */}
      <button
        type="button"
        onClick={onCreateNew}
        className="flex items-center gap-[8px] pl-[10px] pr-[12px] py-[8px] rounded-[12px] bg-surface-white border border-border hover:bg-surface transition-colors"
      >
        <Plus size={24} className="text-content-subtle shrink-0" />
        <span className="font-crm text-body-3 text-content-subtle whitespace-nowrap">
          Create new estimate
        </span>
      </button>

      {/* Sort */}
      <button
        type="button"
        onClick={onSort}
        className="flex items-center gap-[8px] pl-[10px] pr-[12px] py-[8px] rounded-[12px] hover:bg-surface transition-colors"
      >
        <ArrowUpDown size={24} className="text-content shrink-0" />
        <span className="font-crm text-body-3 font-bold text-content whitespace-nowrap">
          Sort
        </span>
      </button>
    </div>
  )
}
