import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function NotificationDrawer() {
  const { savedForLaterTasks, removeSavedTask, isNotificationDrawerOpen, setIsNotificationDrawerOpen } = useApp()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {isNotificationDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNotificationDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-[#2B6B52]" />
                <h2 className="font-semibold text-[#21272a]">Saved for later</h2>
                {savedForLaterTasks.length > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#2B6B52' }}
                  >
                    {savedForLaterTasks.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-[#838383] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-3">
              {savedForLaterTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <Bell size={32} className="text-[#e5e5e5] mb-3" />
                  <p className="text-sm text-[#838383]">No saved tasks yet</p>
                  <p className="text-xs text-[#838383] mt-1">Click the bell icon on any task to save it here</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-3">
                  {savedForLaterTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl border border-[#e5e5e5] p-3 shadow-card"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#21272a] font-medium leading-snug">{task.task}</p>
                          {task.contact && (
                            <p className="text-xs text-[#838383] mt-1">{task.contact}</p>
                          )}
                          {task.account && (
                            <p className="text-xs text-[#565656] font-medium">{task.account}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeSavedTask(task.id)}
                          className="p-1 rounded hover:bg-gray-100 text-[#838383] shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {task.opportunityId && (
                        <button
                          onClick={() => {
                            navigate(`/opportunities/${task.opportunityId}`)
                            setIsNotificationDrawerOpen(false)
                          }}
                          className="mt-2 flex items-center gap-1 text-xs text-[#2B6B52] font-medium hover:underline"
                        >
                          Open <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {savedForLaterTasks.length > 0 && (
              <div className="px-5 py-3 border-t border-[#e5e5e5]">
                <button
                  onClick={() => savedForLaterTasks.forEach(t => removeSavedTask(t.id))}
                  className="text-sm text-[#838383] hover:text-[#565656] transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
