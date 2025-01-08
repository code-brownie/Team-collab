/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from 'react';
import { useSocket } from './SocketContext';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from './AuthContext';


export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket, isConnected } = useSocket();
    const { userId } = useContext(AuthContext);
    const { toast } = useToast();

    useEffect(() => {
        if (!isConnected || !userId) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/notifications/unread/${userId.id}`);
                const data = await response.json();
                setNotifications(data.notifications);
                setUnreadCount(data.notifications.length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        socket.on('notification', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast({
                title: notification.type.replace('_', ' '),
                description: notification.message,
            });
        });

        return () => {
            socket.off('notification');
        };
    }, [socket, isConnected, userId]);

    const markAsRead = async (notificationId) => {
        console.log('notificationId', notificationId);
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId.id,
                    notificationId
                })
            });
            if (response.ok) {
                toast({
                    title: 'Notification Marked',
                    variant: 'default'
                })

                setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
                setUnreadCount((prev) => Math.max(0, prev - 1));
            } else {
                toast({
                    title: 'Fail to Mark the notification',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            toast({
                title: 'Fail to Mark the notification',
                variant: 'destructive'
            })
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId.id,
                    notificationId
                })
            });
            if (response.ok) {
                toast({
                    title: 'Notification deleted',
                    variant: 'default'
                })
                setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
                setUnreadCount((prev) => Math.max(0, prev - 1));
            }

        } catch (error) {
            toast({
                title: 'Fail to delete the notification',
                variant: 'destructive'
            })
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/read-all/${userId.id}`, {
                method: 'PUT',
            });

            if (response.ok) {
                toast({
                    title: 'Notification Marked',
                    variant: 'default'
                })
                setNotifications([]);
                setUnreadCount(0);
            }

        } catch (error) {
            toast({
                title: 'Fail to Mark the notification',
                variant: 'destructive'
            })
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                deleteNotification,
                markAllAsRead,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
