// Figma node 1279:84806 (component set: tabNumber 1–4)
// Container: border-b border-border
// Active tab:   border-b-2 border-border-primary-bold, text-content-primary
// Inactive tab: border-b-2 border-transparent,        text-content-disabled
// Each tab: px-[16px] py-[12px], rounded-tl-xl rounded-tr-xl (12px)
// Typography: font-crm text-body-2 font-bold (Label/L1, bold body-2 18px)

export default function TabsV({ tabs = [], activeTab, onTabChange, className = '' }) {
  return (
    <div className={`border-b border-border flex items-center ${className}`}>
      {tabs.map(tab => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              px-4 py-3 -mb-px font-crm text-body-2 font-bold capitalize
              rounded-tl-xl rounded-tr-xl border-b-2
              transition-colors duration-[180ms] ease-out
              ${isActive
                ? 'border-border-primary-bold text-content-primary'
                : 'border-transparent text-content-disabled'
              }
            `}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
