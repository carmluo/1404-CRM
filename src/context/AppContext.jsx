import React, { createContext, useContext, useState } from 'react'
import { opportunities as initialOpportunities, accounts as initialAccounts } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [savedForLaterTasks, setSavedForLaterTasks] = useState([])
  const [completedTaskIds, setCompletedTaskIds] = useState([])
  const [opportunities, setOpportunities] = useState(initialOpportunities)
  const [accounts] = useState(initialAccounts)
  const [notes, setNotes] = useState(
    initialOpportunities.flatMap(opp =>
      (opp.notes || []).map(n => ({
        ...n,
        entityType: 'opportunity',
        entityId: opp.id,
        linkedOppId: n.linkedOppId ?? null,
        linkedAccountId: n.linkedAccountId ?? null,
      }))
    )
  )
  const [activeFilters, setActiveFilters] = useState({})
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  function showToast(message, { onUndo } = {}) {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  function dismissToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  function saveTaskForLater(task) {
    setSavedForLaterTasks(prev => {
      const exists = prev.find(t => t.id === task.id)
      if (exists) return prev
      return [...prev, task]
    })
    setIsNotificationDrawerOpen(true)
  }

  function removeSavedTask(taskId) {
    setSavedForLaterTasks(prev => prev.filter(t => t.id !== taskId))
  }

  function completeTask(taskId) {
    setCompletedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    )
  }

  function addOpportunity(opp) {
    setOpportunities(prev => [opp, ...prev])
  }

  function addEstimate(oppId, estimate) {
    setOpportunities(prev => prev.map(opp =>
      opp.id === oppId
        ? { ...opp, estimates: [...(opp.estimates || []), estimate] }
        : opp
    ))
  }

  function addNote(entityType, entityId, noteData) {
    setNotes(prev => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        type: noteData.type,
        body: noteData.body,
        pinned: noteData.pinned || false,
        createdAt: new Date().toISOString().split('T')[0],
        linkedOppId: noteData.linkedOppId || null,
        linkedAccountId: noteData.linkedAccountId || null,
        entityType,
        entityId,
      },
    ])
  }

  function togglePinNote(noteId) {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n))
  }

  function deleteNote(noteId) {
    setNotes(prev => prev.filter(n => n.id !== noteId))
  }

  function addDocument(oppId, doc) {
    setOpportunities(prev => prev.map(opp =>
      opp.id === oppId
        ? { ...opp, documents: [...(opp.documents || []), doc] }
        : opp
    ))
  }

  function deleteDocument(oppId, docName) {
    setOpportunities(prev => prev.map(opp =>
      opp.id === oppId
        ? { ...opp, documents: (opp.documents || []).filter(d => d.name !== docName) }
        : opp
    ))
  }

  function sendEstimateEmail(oppId, estimateKey, emailData) {
    const today = new Date().toISOString().split('T')[0]
    setOpportunities(prev => prev.map(opp => {
      if (opp.id !== oppId) return opp
      return {
        ...opp,
        estimates: (opp.estimates || []).map(est =>
          (est.id === estimateKey || est.name === estimateKey)
            ? { ...est, status: 'Sent' }
            : est
        ),
        activities: {
          ...opp.activities,
          log: [
            ...(opp.activities?.log || []),
            {
              id: `log-email-${Date.now()}`,
              type: 'email',
              description: `Emailed estimate: ${emailData.estimateName}`,
              bold: emailData.to,
              date: today,
            },
          ],
        },
      }
    }))
  }

  return (
    <AppContext.Provider value={{
      savedForLaterTasks,
      saveTaskForLater,
      removeSavedTask,
      completedTaskIds,
      completeTask,
      opportunities,
      addOpportunity,
      addEstimate,
      deleteDocument,
      sendEstimateEmail,
      accounts,
      addDocument,
      notes,
      addNote,
      togglePinNote,
      deleteNote,
      activeFilters,
      setActiveFilters,
      isNotificationDrawerOpen,
      setIsNotificationDrawerOpen,
      toasts,
      showToast,
      dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
