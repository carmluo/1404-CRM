import { useState } from 'react'
import { Square, CheckSquare, ChevronLeft, ChevronRight, ChevronDown, Pencil } from 'lucide-react'
import { format, addDays, parseISO, isBefore, isAfter, isSameDay } from 'date-fns'
import IconActivityType from './IconActivityType'
import AddTaskModal from './AddTaskModal'

// dateOffset: -1 = overdue, 0 = today, 1 = tomorrow, 2 = future
// Annotation: "everything previous to 'today' is 'overdue'"
// Annotation: "everything beyond 'tomorrow' is 'future'"
function getTitle(dateOffset) {
  if (dateOffset < 0) return 'Overdue tasks'
  if (dateOffset === 0) return "Today's tasks"
  if (dateOffset === 1) return "Tomorrow's tasks"
  return 'Future tasks'
}

function filterByOffset(tasks, dateOffset) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = addDays(today, 1)

  return tasks.filter(task => {
    if (!task.dueDate) return dateOffset === 0
    const due = parseISO(task.dueDate)
    if (dateOffset < 0) return isBefore(due, today)
    if (dateOffset === 0) return isSameDay(due, today)
    if (dateOffset === 1) return isSameDay(due, tomorrow)
    // future: everything beyond tomorrow
    return isAfter(due, tomorrow)
  })
}

function getActionType(actions = []) {
  if (actions.includes('phone')) return 'call'
  if (actions.includes('email')) return 'mail'
  if (actions.includes('arrow')) return 'link'
  return null
}

// Figma node 1480:34790 — dashboard-module (tasks variant)
export default function Tasklist({
  tasks = [],
  completedTaskIds = [],
  onComplete,
  onSaveLater,
  onPhone,
  onEmail,
  onNavigate,
}) {
  const [dateOffset, setDateOffset] = useState(0)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const displayDate = addDays(today, dateOffset)

  const title = getTitle(dateOffset)
  const visibleTasks = filterByOffset(tasks, dateOffset)

  function prevOffset() {
    setDateOffset(o => Math.max(o - 1, -1))
  }

  function nextOffset() {
    setDateOffset(o => Math.min(o + 1, 2))
  }

  return (
    <>
      <div
        className="rounded-card flex flex-col w-full"
        style={{
          backgroundColor: 'rgba(255,255,255,0.7)',
          paddingTop: 12,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          gap: 8,
        }}
      >
        {/* Header — h-[40px], justify-between */}
        <div
          className="flex items-center justify-between shrink-0 w-full"
          style={{ height: 40 }}
        >
          {/* Left: [<] [title] [>]  [date badge] — gap-[11px] between nav group and badge */}
          <div className="flex items-center shrink-0" style={{ gap: 11 }}>
            {/* Nav group: chevrons + title — gap-[8px] */}
            <div className="flex items-center" style={{ gap: 8 }}>
              <button
                onClick={prevOffset}
                disabled={dateOffset <= -1}
                className="flex items-center justify-center transition-colors hover:bg-surface disabled:opacity-30 rounded-[8px]"
                style={{ width: 22, height: 22 }}
              >
                <ChevronLeft size={16} strokeWidth={2} className="text-content-subtle" />
              </button>
              <p
                className="font-crm font-bold whitespace-nowrap"
                style={{ fontSize: 18, lineHeight: 'normal', color: '#232323' }}
              >
                {title}
              </p>
              <button
                onClick={nextOffset}
                disabled={dateOffset >= 2}
                className="flex items-center justify-center transition-colors hover:bg-surface disabled:opacity-30 rounded-[8px]"
                style={{ width: 22, height: 22 }}
              >
                <ChevronRight size={16} strokeWidth={2} className="text-content-subtle" />
              </button>
            </div>

            {/* Date badge — bg-white, rounded-[12px], h-[40px], pl-[12px] pr-[10px] py-[8px] */}
            <button
              className="flex items-center bg-surface-white rounded-xl transition-colors hover:bg-surface-hover"
              style={{
                height: 40,
                paddingLeft: 12,
                paddingRight: 10,
                paddingTop: 8,
                paddingBottom: 8,
                gap: 4,
              }}
            >
              <span
                className="font-crm whitespace-nowrap"
                style={{ fontSize: 14, lineHeight: '21px', color: '#565656' }}
              >
                {format(displayDate, 'MMMM d')}
              </span>
              <ChevronDown size={12} strokeWidth={2} className="text-content-disabled" />
            </button>
          </div>

          {/* Add task button — bg-brand-action, rounded-[12px], pl-[10px] pr-[12px] py-[8px], gap-[8px] */}
          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex items-center font-crm text-content-invert rounded-xl transition-opacity hover:opacity-90 shrink-0"
            style={{
              paddingLeft: 10,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              gap: 8,
              backgroundColor: '#326757',
              border: 'none',
            }}
          >
            <Pencil size={24} strokeWidth={1.75} />
            <span style={{ fontSize: 14, lineHeight: '21px' }}>Add task</span>
          </button>
        </div>

        {/* Task list — gap-[6px], max-height scroll */}
        <div className="flex flex-col overflow-y-auto" style={{ gap: 6, maxHeight: 340 }}>
          {visibleTasks.length === 0 ? (
            <p
              className="font-crm text-content-disabled text-center"
              style={{ fontSize: 14, lineHeight: '21px', padding: '16px 8px' }}
            >
              No tasks for this period.
            </p>
          ) : (
            visibleTasks.map(task => {
              const isCompleted = completedTaskIds.includes(task.id)
              const actionType = getActionType(task.actions)
              return (
                <div
                  key={task.id}
                  className="flex items-center shrink-0 w-full rounded-card"
                  style={{
                    backgroundColor: '#f2f2f2',
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingTop: 8,
                    paddingBottom: 8,
                    gap: 12,
                  }}
                >
                  {/* Checkbox + task name */}
                  <div className="flex flex-1 min-w-0 items-center" style={{ gap: 8 }}>
                    <button
                      onClick={() => onComplete?.(task.id)}
                      className="shrink-0 flex items-center justify-center"
                      style={{ width: 20, height: 20 }}
                    >
                      {isCompleted
                        ? <CheckSquare size={20} color="#2B6B52" strokeWidth={1.75} />
                        : <Square size={20} color="#838383" strokeWidth={1.75} />
                      }
                    </button>
                    <p
                      className={`flex-1 min-w-0 font-crm truncate ${isCompleted ? 'line-through' : ''}`}
                      style={{
                        fontSize: 14,
                        lineHeight: '21px',
                        color: isCompleted ? '#838383' : '#232323',
                      }}
                    >
                      {task.task}
                    </p>
                  </div>

                  {/* Contact / company — w-[101px] */}
                  <div
                    className="shrink-0 flex flex-col items-start"
                    style={{ width: 101 }}
                  >
                    <p
                      className="font-crm font-bold w-full truncate"
                      style={{ fontSize: 14, lineHeight: '21px', color: '#414141' }}
                    >
                      {task.contact}
                    </p>
                    <p
                      className="font-crm italic w-full truncate"
                      style={{ fontSize: 12, lineHeight: 'normal', color: '#565656' }}
                    >
                      {task.account}
                    </p>
                  </div>

                  {/* Action icons — bell + action type — gap-[4px] */}
                  <div className="flex items-center shrink-0" style={{ gap: 4 }}>
                    <IconActivityType
                      type="notification"
                      onClick={() => onSaveLater?.(task)}
                    />
                    {actionType === 'call' && (
                      <IconActivityType type="call" onClick={() => onPhone?.(task)} />
                    )}
                    {actionType === 'mail' && (
                      <IconActivityType type="mail" onClick={() => onEmail?.(task)} />
                    )}
                    {actionType === 'link' && (
                      <IconActivityType type="link" onClick={() => onNavigate?.(task)} />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {isAddTaskOpen && (
        <AddTaskModal
          onClose={() => setIsAddTaskOpen(false)}
          onSave={newTask => {
            console.log('New task:', newTask)
          }}
        />
      )}
    </>
  )
}
