require('dotenv').config();
const { Server } = require("socket.io");
const Message = require('../models/Message');
let io;
const connectedUsers = {};
const teamConnectedUsers = {};
const Mode = process.env.NODE_ENV;
const URL = Mode === 'production'
    ? process.env.API_BASE_URL_PROD
    : process.env.API_BASE_URL_DEV;
const configureSocket = (server) => {
    console.log("Initializing Socket.IO server...");
    console.log(URL + "in the socket configuration")
    io = new Server(server, {
        cors: {
            origin: URL,
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log(`New socket connection: ${socket.id}`);

        // Register individual user
        socket.on("register", (userId) => {
            if (!userId) {
                return;
            }

            connectedUsers[userId] = socket.id;

            socket.emit("registered", {
                userId,
                socketId: socket.id,
                status: "success",
            });
        });

        // Register a team and its members
        socket.on("registerTeam", ({ teamId, memberIds }) => {
            if (!teamId || !Array.isArray(memberIds)) {
                return;
            }

            // Create or update the team's socket ID list
            if (!teamConnectedUsers[teamId]) {
                teamConnectedUsers[teamId] = [];
            }

            // Add current user's socket to the team's list
            if (!teamConnectedUsers[teamId].includes(socket.id)) {
                teamConnectedUsers[teamId].push(socket.id);
            }

            // Store each member's socket ID if they're online
            memberIds.forEach((memberId) => {
                const memberSocketId = connectedUsers[memberId];
                if (memberSocketId && !teamConnectedUsers[teamId].includes(memberSocketId)) {
                    teamConnectedUsers[teamId].push(memberSocketId);
                }
            });

            // Acknowledge team registration
            socket.emit("teamRegistered", {
                teamId,
                members: teamConnectedUsers[teamId],
                status: "success",
            });
        });

        // message events handling
        socket.on("sendMessage", async ({ teamId, message, senderId, senderName }) => {
            if (!teamId || !message || !senderId) return;

            try {
                // Save message to database
                const newMessage = await Message.create({
                    content: message,
                    teamId,
                    senderId,
                    senderName,
                    timestamp: new Date()
                });

                const messageData = {
                    id: newMessage.id,
                    content: message,
                    senderId,
                    senderName,
                    timestamp: newMessage.timestamp
                };

                // Emit to all team members
                if (teamConnectedUsers[teamId]) {
                    teamConnectedUsers[teamId].forEach((socketId) => {
                        io.to(socketId).emit("newMessage", {
                            teamId,
                            message: messageData,
                        });
                    });
                }
            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('messageError', { error: 'Failed to save message' });
            }
        });

        socket.on("typing", ({ teamId, userId, userName }) => {
            if (!teamId || !userId) return;

            if (teamConnectedUsers[teamId]) {
                teamConnectedUsers[teamId].forEach((socketId) => {
                    if (socketId !== socket.id) {
                        io.to(socketId).emit("userTyping", {
                            teamId,
                            userId,
                            userName,
                        });
                    }
                });
            }
        });


        // Handle disconnection
        socket.on("disconnect", () => {
            // Remove user from `connectedUsers`
            const userId = Object.keys(connectedUsers).find(
                (key) => connectedUsers[key] === socket.id
            );
            if (userId) {
                delete connectedUsers[userId];
            }

            // Remove socket from all teams
            Object.keys(teamConnectedUsers).forEach((teamId) => {
                teamConnectedUsers[teamId] = teamConnectedUsers[teamId].filter(
                    (id) => id !== socket.id
                );

                // Remove the team if no sockets are left
                if (teamConnectedUsers[teamId].length === 0) {
                    delete teamConnectedUsers[teamId];
                }
            });

            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = { configureSocket, getSocketInstance: () => io, connectedUsers, teamConnectedUsers };
