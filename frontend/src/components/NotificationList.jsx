import { useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const NotificationList = () => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead } = useContext(NotificationContext)

  const getNotificationIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'task_assigned':
        return <Check className="w-4 h-4 text-green-500" />
      case 'task_completed':
        return <CheckCheck className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now'

    try {
      const now = new Date()
      const notificationDate = new Date(timestamp)

      // Check if the date is valid
      if (isNaN(notificationDate.getTime())) {
        return 'Just now'
      }

      const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60))

      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } catch (error) {
      console.error('Error parsing timestamp:', error)
      return 'Just now'
    }
  }

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="container mx-auto px-4">
        <Card className="w-full border-none shadow-none bg-transparent">
          <CardHeader className="sticky top-0 bg-gray-50 z-10 px-0 pt-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notifications
              </CardTitle>
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[calc(100vh-120px)]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                  <Bell className="w-12 h-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No new notifications</p>
                  <p className="text-sm text-gray-400">We will notify you when something arrives</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-900 font-medium">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark as read
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="h-8 px-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default NotificationList