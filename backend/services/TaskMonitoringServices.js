const cron = require('node-cron');
const { Op } = require('sequelize');
const Task = require('../models/Task');
const notificationService = require('./NotificationServices');

// Function to check tasks approaching deadline (within 24 hours)
async function checkTaskDeadlines() {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const tasks = await Task.findAll({
            where: {
                deadline: {
                    [Op.lt]: tomorrow,
                    [Op.gt]: new Date()
                },
                status: {
                    [Op.notIn]: ['Done', 'Review']
                },
                isExpired: false
            }
        });

        for (const task of tasks) {
            await notificationService.createNotification(
                task.assignedUserId,
                'TASK_DEADLINE_APPROACHING',
                `Task "${task.title}" is due within 24 hours`,
                {
                    taskId: task.id,
                    projectId: task.projectId,
                    title: task.title,
                    deadline: task.deadline
                }
            );
        }
    } catch (error) {
        console.error('Error checking task deadlines:', error);
    }
}

// Function to check and update expired tasks
async function checkImmediateDeadlines() {
    try {
        console.log('Hey the task is being monitored...')
        const now = new Date();

        const tasks = await Task.findAll({
            where: {
                deadline: {
                    [Op.lt]: now
                },
                status: {
                    [Op.notIn]: ['Done', 'Review']
                },
                isExpired: false
            }
        });
        console.log('The task which is for expiry', tasks);

        for (const task of tasks) {
            // Mark task as expired
            await task.update({
                isExpired: true
            });

            // Send notification for expired tasks
            await notificationService.createNotification(
                task.assignedUserId,
                'TASK_EXPIRED',
                `Task "${task.title}" has passed its deadline`,
                {
                    taskId: task.id,
                    projectId: task.projectId,
                    title: task.title,
                    deadline: task.deadline
                }
            );
        }
    } catch (error) {
        console.error('Error checking immediate deadlines:', error);
    }
}

// Initialize cron jobs
function initializeTaskMonitoring() {
    // Check approaching deadlines daily at midnight
    cron.schedule('0 0 * * *', async () => {
        await checkTaskDeadlines();
    });

    // Check for expired tasks every hour
    cron.schedule('0 * * * *', async () => {
        await checkImmediateDeadlines();
    });
}

module.exports = {
    initializeTaskMonitoring,
    checkTaskDeadlines,
    checkImmediateDeadlines
};