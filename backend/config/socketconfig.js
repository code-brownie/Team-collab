const { Server } = require('socket.io');
let io;
const connectedUsers = {};

const configureSocket = (server) => {
    console.log('Initializing Socket.IO server...');

    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
        transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
        console.log(`New socket connection: ${socket.id}`);

        socket.on("register", (userId) => {
            if (!userId) {
                console.log('Warning: Received empty userId in register event');
                return;
            }

            console.log(`Registering user ${userId} with socket ${socket.id}`);
            connectedUsers[userId] = socket.id;

            // Confirm registration to client
            socket.emit('registered', {
                userId,
                socketId: socket.id,
                status: 'success'
            });

            console.log('Current connected users:', connectedUsers);
        });

        socket.on("disconnect", () => {
            const userId = Object.keys(connectedUsers).find(
                key => connectedUsers[key] === socket.id
            );
            if (userId) {
                delete connectedUsers[userId];
                console.log(`User ${userId} disconnected`);
                console.log('Current connected users:', connectedUsers);
            }
        });
    });

    return io;
};

module.exports = { configureSocket, getSocketInstance: () => io, connectedUsers };