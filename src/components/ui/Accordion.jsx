import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'

export default function Accordion({
  icon,
  label,
  showAiTag = false,
  defaultOpen = true,
  children,
  className = '',
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`flex flex-col p-3 rounded-[8px] w-full ${open ? 'gap-4' : ''} ${className}`}>
      <button
        type="button"
        className="flex items-center w-full text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-crm text-body-2 font-bold text-content-subtle whitespace-nowrap">
              {label}
            </span>
          </div>
          {showAiTag && (
            <div className="bg-brand border border-border-primary rounded-[100px] flex gap-1 items-center pl-[10px] pr-3 py-1 shrink-0">
              <Sparkles size={16} className="text-content-primary" />
              <span className="font-crm text-body-3 font-bold text-content-primary">AI</span>
            </div>
          )}
        </div>
        <div
          className={`p-2 rounded-[12px] shrink-0 transition-transform duration-[180ms] ease-out ${open ? '' : '-rotate-90'}`}
        >
          <ChevronDown size={24} className="text-content-subtle" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
            className="overflow-hidden w-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
