const Notification = require('../models/Notification');
const { getSocketInstance, connectedUsers } = require('../config/socketconfig');

const createNotification = async (userId, type, message, data = {}) => {
    try {
        // Create notification in database
        const notification = await Notification.create({
            userId,
            type,
            message,
            data
        });

        // Get socket instance and connected users
        const io = getSocketInstance();
        const userSocketId = connectedUsers[userId];

        // If user is connected, emit notification immediately
        if (userSocketId) {
            io.to(userSocketId).emit('notification', {
                id: notification.id,
                type,
                message,
                data,
                timestamp: notification.createdAt
            });
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

const getUnreadNotifications = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(401).send('UserId is required')
    try {
        const notifications = await Notification.findAll({
            where: {
                userId,
                read: false
            },
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json({ notifications });
    } catch (error) {
        return res.status(500).send('Internal server Error');
    }
};

const markAsRead = async (req, res) => {
    const { notificationId, userId } = req.body;
    console.log(req.body);
    if (!notificationId || !userId) return res.status(404).send('UserId or notification required');
    try {
        const result = await Notification.update(
            { read: true },
            {
                where: {
                    id: notificationId,
                    userId
                }
            }
        );
        if (result[0] > 0) return res.status(200).json({ success: true });
        else return res.status(404).json({ message: 'Notification Not found' });
    } catch (error) {
        return res.status(500).send('Internal server Error');
    }
};

const markAllAsRead = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(401).send('UserId is required!!')
    try {
        const result = await Notification.update(
            { read: true },
            {
                where: {
                    userId,
                    read: false
                }
            }
        );
        return res.status(201).json({ result: result[0] }); // Returns number of notifications marked as read
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
};

const deleteNotification = async (req, res) => {
    const { notificationId, userId } = req.body;
    try {
        const result = await Notification.destroy({
            where: {
                id: notificationId,
                userId
            }
        });
        if (result) return res.status(200).json({ message: 'Notification deleted successfully' });
        else return res.status(401).json({ message: 'Fail to delete notifications' });
    } catch (error) {
        return res.status(500).send('Internal server Error');
    }
};

const getNotificationCount = async (req, res) => {
    const { userId } = req.params;
    if (!userId) return res.status(401).send('userId is required...');
    try {
        const count = await Notification.count({
            where: {
                userId,
                read: false
            }
        });
        if (count) return res.status(200).json({ count });
    } catch (error) {
        return res.status(500).send('Internal server Error');
    }
};

module.exports = {
    createNotification,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationCount
};
