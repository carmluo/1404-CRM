// Figma node 788:178040
// Single pill: rounded-[12px], px-[16px] py-[12px], gap-[8px], icon 24px
// Font: Body 2 (18px/27px), weight 400
// Default: bg rgba(255,255,255,0.7), text #232323
// Active:  bg #2D2D2D, text #F2F2F2

export default function NavLink({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center whitespace-nowrap font-crm transition-colors duration-150"
      style={{
        gap: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        borderRadius: 12,
        backgroundColor: active ? '#2D2D2D' : 'rgba(255,255,255,0.7)',
        color: active ? '#F2F2F2' : '#232323',
        fontSize: 18,
        lineHeight: '27px',
        fontWeight: 400,
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <Icon size={24} strokeWidth={1.75} color={active ? '#F2F2F2' : '#232323'} />
      {label}
    </button>
  )
}
