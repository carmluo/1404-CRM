// Mirrors AccountSearchFilter (node 1080:54456) for the Contacts page
// Search input: bg-surface-white rounded-[100px] w-1/2 pl-[16px] pr-[8px] py-[8px] gap-[8px]
// Saved filters btn: bg-surface-white rounded-[12px] h-[40px] pl-[12px] pr-[10px] py-[8px] gap-[4px]
// Advanced filters btn: bg-surface-white rounded-[12px] pl-[10px] pr-[12px] py-[8px] gap-[8px]
// New contact btn: bg-brand-action rounded-[12px] pl-[10px] pr-[12px] py-[8px] gap-[8px]
import { Search, SlidersHorizontal, ChevronDown, Plus, X } from 'lucide-react'

export default function ContactSearchFilter({
  query,
  onQueryChange,
  onFilterClick,
  onNewContact,
}) {
  return (
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Search input */}
      <div className="w-1/2 min-w-0 bg-surface-white rounded-[100px] flex gap-[8px] items-center pl-[16px] pr-[8px] py-[8px]">
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder='Ask about your contacts... "unresponsive leads"'
          className="flex-1 min-w-0 font-crm text-body-3 text-content bg-transparent focus:outline-none placeholder:text-content-disabled"
        />
        {query ? (
          <button
            onClick={() => onQueryChange('')}
            className="shrink-0 w-[24px] h-[24px] flex items-center justify-center text-content-disabled hover:text-content transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          <div className="shrink-0 w-[24px] h-[24px] flex items-center justify-center text-content-disabled">
            <Search size={16} />
          </div>
        )}
      </div>

      {/* Filter buttons + CTA */}
      <div className="flex items-center gap-[12px] shrink-0">
        {/* Saved filters */}
        <button className="bg-surface-white rounded-[12px] flex gap-[4px] h-[40px] items-center justify-center pl-[12px] pr-[10px] py-[8px] hover:bg-surface-hover transition-colors">
          <span className="font-crm text-body-3 text-content-subtle whitespace-nowrap">Saved filters</span>
          <ChevronDown size={20} className="text-content-subtle" />
        </button>

        {/* Advanced filters */}
        <button
          onClick={onFilterClick}
          className="bg-surface-white rounded-[12px] flex gap-[8px] items-center pl-[10px] pr-[12px] py-[8px] hover:bg-surface-hover transition-colors"
        >
          <SlidersHorizontal size={24} className="text-content-subtle" />
          <span className="font-crm text-body-3 text-content-subtle whitespace-nowrap">Advanced filters</span>
        </button>

        {/* New contact */}
        <button
          onClick={onNewContact}
          className="bg-brand-action rounded-[12px] flex gap-[8px] items-center pl-[10px] pr-[12px] py-[8px] hover:opacity-90 transition-opacity"
        >
          <Plus size={24} className="text-content-invert" />
          <span className="font-crm text-body-3 text-content-invert whitespace-nowrap">New contact</span>
        </button>
      </div>
    </div>
  )
}
