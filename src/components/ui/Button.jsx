// Figma node 698:59025
// Button component — 3 variants × 4 states × 4 layout modes
// Variants: default | brand-primary | link
// States:   Default | Hover | Pressed | Disabled
// Layouts:  label-only | icon-before | icon-after (chevron) | icon-only
//
// Base:          h-[40px] rounded-[12px] font-crm text-body-3 whitespace-nowrap
// default:       bg-surface-white text-content-subtle | hover:bg-surface-elevated | active:bg-surface-press
// brand-primary: bg-brand-action text-content-invert | hover:bg-brand-action-hover
// link:          transparent text-content | hover:bg-surface-elevated
// disabled:      bg-surface-disabled text-content-disabled
// active (selected override): bg-surface-invert text-content-invert
//
// icon-only:           p-[8px],                   icon 24px
// icon-before + label: pl-[10px] pr-[12px] py-[8px] gap-[8px], icon 24px
// icon-after (chevron): pl-[12px] pr-[10px] py-[8px] gap-[4px], chevron 20px
// label-only:          px-[12px] py-[8px]
import { ChevronDown } from 'lucide-react'

export default function Button({
  children,
  icon: Icon,
  withChevron = false,
  iconOnly = false,
  variant = 'default',    // 'default' | 'brand-primary' | 'link'
  active = false,         // selected/active override — bg-surface-invert
  disabled = false,
  subtle,                 // no-op — kept for backward compat
  onClick,
  className = '',
  type: htmlType = 'button',
}) {
  const variantClasses = disabled
    ? 'bg-surface-disabled text-content-disabled cursor-not-allowed'
    : active
      ? 'bg-surface-invert text-content-invert'
      : variant === 'brand-primary'
        ? 'bg-brand-action text-content-invert hover:bg-brand-action-hover'
        : variant === 'link'
          ? 'text-content hover:bg-surface-elevated'
          : 'bg-surface-white text-content-subtle hover:bg-surface-elevated active:bg-surface-press'

  const base = [
    'inline-flex items-center shrink-0',
    'h-[40px] rounded-[12px]',
    'font-crm text-body-3 whitespace-nowrap',
    'transition-colors',
    variantClasses,
    className,
  ].join(' ')

  if (iconOnly && Icon) {
    return (
      <button type={htmlType} onClick={onClick} disabled={disabled} className={`${base} p-[8px]`}>
        <Icon size={24} strokeWidth={1.75} />
      </button>
    )
  }

  if (Icon && !withChevron) {
    return (
      <button type={htmlType} onClick={onClick} disabled={disabled} className={`${base} gap-[8px] pl-[10px] pr-[12px] py-[8px]`}>
        <Icon size={24} strokeWidth={1.75} />
        {children}
      </button>
    )
  }

  if (withChevron) {
    return (
      <button type={htmlType} onClick={onClick} disabled={disabled} className={`${base} gap-[4px] pl-[12px] pr-[10px] py-[8px]`}>
        {children}
        <ChevronDown size={20} strokeWidth={2} />
      </button>
    )
  }

  return (
    <button type={htmlType} onClick={onClick} disabled={disabled} className={`${base} px-[12px] py-[8px]`}>
      {children}
    </button>
  )
}
