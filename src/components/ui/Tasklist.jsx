import { Square, CheckSquare } from 'lucide-react'
import IconActivityType from './IconActivityType'

// Figma node 1001:4445
function getActionType(actions = []) {
  if (actions.includes('phone')) return 'call'
  if (actions.includes('email')) return 'mail'
  if (actions.includes('arrow')) return 'link'
  return null
}

export default function Tasklist({
  tasks = [],
  completedTaskIds = [],
  onComplete,
  onSaveLater,
  onPhone,
  onEmail,
  onNavigate,
}) {
  return (
    <div
      className="rounded-[8px] flex flex-col w-full"
      style={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 16,
        gap: 8,
      }}
    >
      {/* Header */}
      <div className="flex items-center shrink-0 w-full">
        <p className="font-crm font-bold whitespace-nowrap" style={{ fontSize: 18, lineHeight: 'normal', color: '#21272a' }}>
          Today's tasks
        </p>
      </div>

      {/* Scrollable task list */}
      <div className="flex flex-col overflow-y-auto" style={{ gap: 6, maxHeight: 340 }}>
          {tasks.map(task => {
            const isCompleted = completedTaskIds.includes(task.id)
            const actionType = getActionType(task.actions)
            return (
              <div
                key={task.id}
                className="flex items-center shrink-0 w-full rounded-[8px]"
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
                    className="shrink-0 overflow-hidden flex items-center justify-center"
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

                {/* Contact / company column */}
                <div
                  className="shrink-0 flex flex-col items-start"
                  style={{ width: 101, fontSize: 14, lineHeight: '21px' }}
                >
                  <p className="font-crm font-bold w-full truncate" style={{ color: '#414141' }}>
                    {task.contact}
                  </p>
                  <p className="font-crm italic w-full truncate" style={{ color: '#565656' }}>
                    {task.account}
                  </p>
                </div>

                {/* Action icons */}
                <div className="flex items-center shrink-0" style={{ gap: 4 }}>
                  <IconActivityType
                    type="notification"
                    onClick={() => onSaveLater?.(task)}
                  />
                  {actionType === 'call' && (
                    <IconActivityType
                      type="call"
                      onClick={() => onPhone?.(task)}
                    />
                  )}
                  {actionType === 'mail' && (
                    <IconActivityType
                      type="mail"
                      onClick={() => onEmail?.(task)}
                    />
                  )}
                  {actionType === 'link' && (
                    <IconActivityType
                      type="link"
                      onClick={() => onNavigate?.(task)}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
    </div>
  )
}
