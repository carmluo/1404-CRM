import { useState, useRef, useEffect } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isWithinInterval,
} from 'date-fns'

const PRESETS = [
  { label: 'Past 30 days', days: 30 },
  { label: 'Past 60 days', days: 60 },
  { label: 'Past 90 days', days: 90 },
]

const spring = { type: 'tween', duration: 0.18, ease: 'easeOut' }
const fastSpring = { type: 'tween', duration: 0.14, ease: 'easeOut' }

function Calendar({ rangeStart, rangeEnd, onSelectDate, displayMonth, onPrevMonth, onNextMonth }) {
  const monthStart = startOfMonth(displayMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(endOfMonth(displayMonth), { weekStartsOn: 0 })

  const days = []
  let d = calStart
  while (d <= calEnd) { days.push(d); d = addDays(d, 1) }

  function isInRange(day) {
    if (!rangeStart || !rangeEnd) return false
    return isWithinInterval(day, { start: rangeStart, end: rangeEnd })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="p-1 rounded-lg hover:bg-[#F2F2F2] text-[#414141]">
          <ChevronLeft size={16} />
        </button>
        <span className="font-crm text-[14px] font-medium text-[#232323]">
          {format(displayMonth, 'MMMM yyyy')}
        </span>
        <button onClick={onNextMonth} className="p-1 rounded-lg hover:bg-[#F2F2F2] text-[#414141]">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => (
          <div key={day} className="text-center font-crm text-[11px] text-[#838383] py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day, i) => {
          const inCurMonth = isSameMonth(day, displayMonth)
          const isStart = rangeStart && isSameDay(day, rangeStart)
          const isEnd = rangeEnd && isSameDay(day, rangeEnd)
          const inRange = isInRange(day)

          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.82 }}
              transition={fastSpring}
              onClick={() => onSelectDate(day)}
              className="relative h-8 w-full font-crm text-[13px] flex items-center justify-center"
              style={{ color: !inCurMonth ? '#B3B3B3' : isStart || isEnd ? '#FFFFFF' : '#232323' }}
            >
              {inRange && !isStart && !isEnd && (
                <span className="absolute inset-0 bg-[#CFE8E0]" />
              )}
              {(isStart || isEnd) && (
                <motion.span
                  layoutId={isStart ? 'cal-start' : 'cal-end'}
                  transition={spring}
                  className="absolute rounded-full"
                  style={{ width: 30, height: 30, backgroundColor: '#326757' }}
                />
              )}
              <span className="relative z-10">{format(day, 'd')}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default function DatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(value || { preset: 'Past 90 days', days: 90 })
  const [pickingStart, setPickingStart] = useState(true)
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const [displayMonth, setDisplayMonth] = useState(new Date())
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isCustomRange = !selected.preset && selected.start && selected.end

  function handlePreset(preset) {
    setSelected({ preset: preset.label, days: preset.days })
    setRangeStart(null)
    setRangeEnd(null)
    onChange && onChange({ preset: preset.label, days: preset.days })
    setIsOpen(false)
  }

  function handleDateSelect(day) {
    if (pickingStart) {
      setRangeStart(day)
      setRangeEnd(null)
      setPickingStart(false)
    } else {
      const start = day < rangeStart ? day : rangeStart
      const end = day < rangeStart ? rangeStart : day
      setRangeStart(start)
      setRangeEnd(end)
      setPickingStart(true)
      const val = { start: format(start, 'yyyy-MM-dd'), end: format(end, 'yyyy-MM-dd') }
      setSelected(val)
      onChange && onChange(val)
      setIsOpen(false)
    }
  }

  const pillClass = 'flex items-center h-[40px] px-[16px] rounded-[12px] font-crm text-[14px] leading-[21px] text-[#414141] whitespace-nowrap bg-white'

  return (
    <LayoutGroup>
      <div ref={ref} className="relative flex items-center">

        {/* Icon pill */}
        <motion.button
          layout
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-[100px] shrink-0"
          initial={{ backgroundColor: '#FFFFFF' }}
          animate={{ backgroundColor: isCustomRange ? '#2D2D2D' : '#FFFFFF' }}
          whileTap={{ scale: 0.88 }}
          transition={spring}
          style={{ width: 40, height: 40 }}
        >
          <motion.div
            animate={{ color: isCustomRange ? '#FFFFFF' : '#414141' }}
            transition={{ duration: 0.18 }}
          >
            <CalendarDays size={21} strokeWidth={1.5} />
          </motion.div>
        </motion.button>

        {/* Label pills — layout-animated container */}
        <motion.div layout className="flex items-center overflow-hidden" transition={spring}>
          <AnimatePresence mode="popLayout" initial={false}>
            {isCustomRange ? (
              <>
                <motion.button
                  key="start-pill"
                  layout
                  onClick={() => setIsOpen(!isOpen)}
                  className={pillClass}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={spring}
                  whileTap={{ scale: 0.96 }}
                >
                  {format(new Date(selected.start + 'T00:00:00'), 'MMM d, yyyy')}
                </motion.button>
                <motion.button
                  key="end-pill"
                  layout
                  onClick={() => setIsOpen(!isOpen)}
                  className={pillClass}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ ...spring }}
                  whileTap={{ scale: 0.96 }}
                >
                  {format(new Date(selected.end + 'T00:00:00'), 'MMM d, yyyy')}
                </motion.button>
              </>
            ) : (
              <motion.button
                key="preset-pill"
                layout
                onClick={() => setIsOpen(!isOpen)}
                className={pillClass}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={spring}
                whileTap={{ scale: 0.96 }}
              >
                {selected.preset ?? 'Select range'}
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="picker"
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={spring}
              style={{ originX: 0, originY: 0, minWidth: 320 }}
              className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-[#e5e5e5] z-50 overflow-hidden"
            >
              {/* Presets */}
              <div className="flex gap-2 p-4 pb-3 border-b border-[#e5e5e5]">
                {PRESETS.map(preset => (
                  <motion.button
                    key={preset.label}
                    onClick={() => handlePreset(preset)}
                    whileTap={{ scale: 0.93 }}
                    className="flex-1 py-1.5 rounded-[12px] font-crm text-[13px]"
                    initial={false}
                    animate={{
                      backgroundColor: selected.preset === preset.label ? '#326757' : '#F2F2F2',
                      color: selected.preset === preset.label ? '#FFFFFF' : '#414141',
                    }}
                    transition={{ duration: 0.14 }}
                  >
                    {preset.label}
                  </motion.button>
                ))}
              </div>

              {/* Calendar */}
              <div className="p-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={pickingStart ? 'start' : 'end'}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.14 }}
                    className="font-crm text-[12px] text-[#838383] mb-3"
                  >
                    {pickingStart ? 'Select a start date' : 'Now select an end date'}
                  </motion.p>
                </AnimatePresence>
                <Calendar
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  onSelectDate={handleDateSelect}
                  displayMonth={displayMonth}
                  onPrevMonth={() => setDisplayMonth(m => subMonths(m, 1))}
                  onNextMonth={() => setDisplayMonth(m => addMonths(m, 1))}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
