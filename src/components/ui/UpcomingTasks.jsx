import { Square, CheckSquare, Check, X, Sparkles } from 'lucide-react'
import { format, parseISO, differenceInDays } from 'date-fns'
import IconActivityType from './IconActivityType'

// Figma node 1279:84903
// Container: flex flex-col items-start px-[16px]
// Section pill: bg-surface rounded-card px-[6px] py-[2px], font-crm text-body-3 text-content-subtlest
// Task row: flex gap-[12px] items-center px-[8px] py-[4px] rounded-card
// Suggested task: text-content-disabled + AI badge (bg-brand rounded-full pl-[10px] pr-[12px] py-[4px])
//   + accept/deny buttons (size-[33.33px] p-[8px] bg-surface-white border-border rounded-card)
// Regular task: text-content + IconActivityType action icons
// Due date: font-crm text-body-3 text-content-subtlest min-w-[115px]

function formatDueDate(dateStr) {
  if (!dateStr) return ''
  const due = parseISO(dateStr)
  const today = new Date()
  const days = differenceInDays(due, today)
  if (days < 0) return `Overdue ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due ${format(due, 'MMM d, yyyy')}`
}

function SuggestedBadge() {
  return (
    <span className="inline-flex items-center gap-[4px] bg-brand rounded-full pl-[10px] pr-[12px] py-[4px] shrink-0">
      <Sparkles size={16} className="text-content-primary" strokeWidth={1.75} />
      <span className="font-crm text-[12px] font-medium text-content-primary whitespace-nowrap">
        Suggested
      </span>
    </span>
  )
}

export default function UpcomingTasks({
  tasks = [],
  completedTaskIds = [],
  onComplete,
  onAccept,
  onDismiss,
  onSaveLater,
  onCall,
  onTaskClick,
  emptyMessage = 'No upcoming tasks.',
}) {
  return (
    <div className="flex flex-col items-start px-[16px] w-full gap-0">
      {/* Section header pill */}
      <div className="bg-surface rounded-card px-[6px] py-[2px] mb-1 shrink-0">
        <span className="font-crm text-body-3 text-content-subtlest whitespace-nowrap">
          Upcoming
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="font-crm text-body-3 text-content-disabled px-[8px] py-[4px]">
          {emptyMessage}
        </p>
      ) : (
        tasks.map(task => {
          const isCompleted = completedTaskIds.includes(task.id)

          return (
            <div
              key={task.id}
              className="flex gap-[12px] items-center px-[8px] py-[4px] rounded-card w-full"
            >
              {/* Checkbox */}
              <button
                onClick={() => onComplete?.(task.id)}
                className="shrink-0 flex items-center justify-center size-[20px]"
              >
                {isCompleted
                  ? <CheckSquare size={20} className="text-content-primary" strokeWidth={1.75} />
                  : <Square size={20} className="text-content-disabled" strokeWidth={1.75} />
                }
              </button>

              {/* Task name + badge */}
              <div className="flex flex-1 min-w-0 gap-[8px] items-center">
                {onTaskClick && task.opportunityId && !isCompleted ? (
                  <button
                    type="button"
                    onClick={() => onTaskClick(task)}
                    className={`font-crm text-body-3 min-w-0 text-left hover:underline ${
                      task.isSuggested ? 'text-content-disabled whitespace-nowrap' : 'text-content'
                    }`}
                  >
                    {task.task}
                  </button>
                ) : (
                  <p className={`font-crm text-body-3 min-w-0 ${
                    isCompleted
                      ? 'text-content-disabled line-through'
                      : task.isSuggested
                        ? 'text-content-disabled whitespace-nowrap'
                        : 'text-content'
                  }`}>
                    {task.task}
                  </p>
                )}
                {task.isSuggested && !isCompleted && <SuggestedBadge />}
              </div>

              {/* Due date */}
              <p className="font-crm text-body-3 text-content-subtlest whitespace-nowrap min-w-[115px] shrink-0">
                {formatDueDate(task.dueDate)}
              </p>

              {/* Actions */}
              {task.isSuggested && !isCompleted ? (
                /* Accept / Deny buttons */
                <div className="flex gap-[4px] items-center shrink-0">
                  <button
                    onClick={() => onAccept?.(task)}
                    className="size-[33.33px] p-[8px] bg-surface-white border border-border rounded-card flex items-center justify-center hover:bg-surface-hover transition-colors duration-[180ms] ease-out"
                  >
                    <Check size={16} className="text-content" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => onDismiss?.(task.id)}
                    className="size-[33.33px] p-[8px] bg-surface-white border border-border rounded-card flex items-center justify-center hover:bg-surface-hover transition-colors duration-[180ms] ease-out"
                  >
                    <X size={16} className="text-content" strokeWidth={1.75} />
                  </button>
                </div>
              ) : (
                /* Action icons for regular tasks */
                <div className="flex gap-[4px] items-center shrink-0">
                  <IconActivityType
                    type="notification"
                    onClick={() => onSaveLater?.(task)}
                  />
                  {task.contact && (
                    <IconActivityType
                      type="call"
                      onClick={() => onCall?.(task)}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
