const Message = require("../../models/Message");
const User = require("../../models/User");

const getMessageForTeam = async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                teamId: req.params.teamId
            },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }],
            order: [['timestamp', 'ASC']]
        });
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

const createMessage = async (req, res) => {
    const { content, teamId, senderId, senderName } = req.body;
    if (!content || !teamId || !senderId) return res.status(404).json({ message: 'content or team or senderName required' })
    try {
        const message = await Message.create({
            content,
            teamId,
            senderId,
            senderName,
            timestamp: new Date()
        });

        const messageWithUser = await Message.findOne({
            where: { id: message.id },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        return res.status(201).json({ message: messageWithUser });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create message' });
    }
};

module.exports = { createMessage, getMessageForTeam };