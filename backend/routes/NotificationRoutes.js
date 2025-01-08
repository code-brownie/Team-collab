const express = require('express');
const router = express.Router();

const NotificationService = require('../services/NotificationServices');
const { getNotificationCount, getUnreadNotifications, markAsRead, markAllAsRead, deleteNotification } = NotificationService;

router.get('/unread/:userId', getUnreadNotifications);
router.get('/count/:userId', getNotificationCount);
router.put('/:id/read', markAsRead);
router.put('/read-all/:userId', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;