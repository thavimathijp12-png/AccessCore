import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_NOTIFICATIONS } from '../data/notificationsData'
import { api } from '../utils/api'

const NotificationsContext = createContext(null)

function mapApiNotification(n) {
  return {
    id: n.notificationCode || n.id,
    title: n.title,
    message: n.message,
    category: n.category || 'System',
    unread: n.unread !== undefined ? n.unread : true,
    timestamp: n.createdAt || new Date().toISOString(),
    link: n.link || '/notifications',
    priority: n.priority || 'Medium',
  }
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ac-notifications')
    return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS
  })

  // Synchronize on mount
  useEffect(() => {
    api.get('/notifications').then(res => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map(mapApiNotification)
        setNotifications(prev => {
          const existingIds = new Set(mapped.map(m => m.id))
          const localOnly = prev.filter(p => !existingIds.has(p.id))
          const merged = [...mapped, ...localOnly]
          localStorage.setItem('ac-notifications', JSON.stringify(merged))
          return merged
        })
      }
    }).catch(() => {})
  }, [])

  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, unread: false } : n))
      localStorage.setItem('ac-notifications', JSON.stringify(updated))
      return updated
    })
    api.patch(`/notifications/${id}/read`).catch(() => {})
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, unread: false }))
      localStorage.setItem('ac-notifications', JSON.stringify(updated))
      return updated
    })
    api.patch('/notifications/read-all').catch(() => {})
  }, [])

  const clearNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      localStorage.setItem('ac-notifications', JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    localStorage.removeItem('ac-notifications')
  }, [])

  const addNotification = useCallback((data) => {
    const newNotif = {
      id: `NOT-${Date.now()}`,
      title: data.title,
      message: data.message,
      category: data.category || 'System',
      unread: true,
      timestamp: new Date().toISOString(),
      link: data.link || '/notifications',
      priority: data.priority || 'Medium',
    }
    setNotifications(prev => {
      const updated = [newNotif, ...prev]
      localStorage.setItem('ac-notifications', JSON.stringify(updated))
      return updated
    })
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}
