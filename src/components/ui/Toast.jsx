// Figma node 1480:22404 — alert/toast
// Container: backdrop-blur-[4px] bg-[rgba(255,255,255,0.7)] rounded-[8px]
//   shadow-[-2px_4px_6px_0px_rgba(0,0,0,0.15)]
//   pl-[24px] pr-[12px] py-[16px] gap-[20px]
// Icon pill: bg-safe rounded-[100px] p-[4px] — Check 24px
// Text: text-body-2 text-content whitespace-nowrap
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Undo2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const spring = { type: 'tween', duration: 0.18, ease: 'easeOut' }

function ToastItem({ toast, onDismiss }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={spring}
      onClick={() => onDismiss(toast.id)}
      className="flex items-center justify-between cursor-pointer rounded-card w-full"
      style={{
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        backgroundColor: 'rgba(255,255,255,0.7)',
        boxShadow: '-2px 4px 6px 0px rgba(0,0,0,0.15)',
        paddingLeft: 24,
        paddingRight: 12,
        paddingTop: 16,
        paddingBottom: 16,
        gap: 20,
      }}
    >
      {/* Left: icon pill + message */}
      <div className="flex items-center gap-[20px] shrink-0">
        {/* Icon pill — bg-safe (#ebffd2) rounded-[100px] p-[4px] */}
        <div
          className="flex items-center justify-center shrink-0 rounded-[100px]"
          style={{ backgroundColor: '#ebffd2', padding: 4 }}
        >
          <Check size={24} strokeWidth={2} style={{ color: '#528002' }} />
        </div>

        {/* Message */}
        <p className="font-crm text-body-2 text-content whitespace-nowrap">
          {toast.message}
        </p>
      </div>

      {/* Undo button — only shown when onUndo provided */}
      {toast.onUndo && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            toast.onUndo()
            onDismiss(toast.id)
          }}
          className="flex items-center gap-[8px] pl-[10px] pr-[12px] py-[4px] rounded-[12px] hover:bg-surface transition-colors shrink-0"
        >
          <Undo2 size={24} className="text-content-subtle" />
          <span className="font-crm text-body-3 text-content-subtle whitespace-nowrap">Undo</span>
        </button>
      )}
    </motion.div>
  )
}

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp()

  return (
    <div
      className="fixed z-[100] flex flex-col items-stretch gap-3 pointer-events-none"
      style={{ top: 116, left: '50%', transform: 'translateX(-50%)', minWidth: '40vw' }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto w-full">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
