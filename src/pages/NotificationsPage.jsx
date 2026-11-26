import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Trash2,
  ArrowRight, Inbox
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useNotifications } from '../context/NotificationsContext'
import { useToast } from '../hooks/useToast'
import ToastContainer from '../components/ui/Toast'
import { NOTIFICATION_CATEGORIES } from '../data/notificationsData'
import { formatDate } from '../utils/helpers'
import { Link } from 'react-router-dom'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, clearAll } = useNotifications()
  const { toasts, toast, dismiss } = useToast()

  const [activeCategory, setActiveCategory] = useState('All')

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'All') return notifications
    return notifications.filter(n => n.category === activeCategory)
  }, [notifications, activeCategory])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1E293B] tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            System dispatch alerts, workflow assignments, approval triggers and security events
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              iconLeft={<Check size={14} />}
              onClick={() => {
                markAllAsRead()
                toast.success('All marked as read')
              }}
            >
              Mark All Read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Trash2 size={14} />}
              onClick={() => {
                clearAll()
                toast.info('Notifications cleared')
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        {NOTIFICATION_CATEGORIES.map(cat => {
          const count = cat === 'All'
            ? notifications.length
            : notifications.filter(n => n.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#6D4AFF] text-white shadow-xs shadow-xs'
                  : 'bg-white  border border-[#EDE8FA]  text-slate-600  hover:border-blue-400'
              }`}
            >
              {cat} <span className="opacity-70 ml-1">({count})</span>
            </button>
          )
        })}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {filteredNotifications.map(notif => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border transition-all ${
                notif.unread
                  ? 'bg-white  border-blue-300  shadow-xs ring-1 ring-blue-500/10'
                  : 'bg-slate-50/70  border-slate-200  opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${notif.unread ? 'bg-[#6D4AFF]' : 'bg-transparent'}`} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800">
                        {notif.title}
                      </span>
                      <Badge color="blue">{notif.category}</Badge>
                      {notif.priority === 'Critical' && <Badge color="red">Critical</Badge>}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{formatDate(notif.timestamp)}</span>
                      {notif.link && (
                        <Link
                          to={notif.link}
                          className="font-medium text-[#6D4AFF] hover:underline inline-flex items-center gap-0.5"
                        >
                          View context <ArrowRight size={11} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {notif.unread && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1 rounded text-slate-400 hover:text-[#6D4AFF] transition-colors"
                      title="Mark as read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredNotifications.length === 0 && (
          <div className="py-16 text-center bg-white rounded-xl border border-[#EDE8FA]">
            <Inbox size={32} className="mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">
              No notifications
            </p>
            <p className="text-xs text-slate-400 mt-1">
              You are all caught up on system updates.
            </p>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
