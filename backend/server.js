require('dotenv').config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const { configureSocket } = require('./config/socketconfig');

const cookieParser = require('cookie-parser')
const taskRoutes = require('./routes/TaskRoutes');
const userRoutes = require('./routes/UserRoutes');
const teamRoutes = require('./routes/TeamRoutes');
const projectRoutes = require('./routes/ProjectRoutes');
const protectedRoute = require('./routes/Protected');
const emailRoutes = require('./routes/EmailRoutes');
const notificationRoutes = require('./routes/NotificationRoutes');
const fileRoutes = require('./routes/FileRoutes');
const fileUpload = require('express-fileupload');
const messageRoutes = require('./routes/MessageRoutes');
const initializeDatabase = require('./config/TableSetup');
const { initializeTaskMonitoring } = require('./services/TaskMonitoringServices');
const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
configureSocket(server);

const Mode = process.env.NODE_ENV;
const URL = process.env.NODE_ENV === 'production'
    ? process.env.API_BASE_URL_PROD
    : process.env.API_BASE_URL_DEV;
const allowedOrigins = [
    'http://localhost:5173',
    'https://brownie-team-collab.vercel.app',
    'https://team-collab.onrender.com'
];

initializeDatabase();
// Configure CORS middleware
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);

//middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send('Hello world');
})

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/auth', protectedRoute);
app.use('/api/email', emailRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

console.log('url', URL);
server.listen(PORT, () => {
    console.log(`sever listening on ${PORT} in ${Mode}`)
    initializeTaskMonitoring();
    console.log('Task monitoring started...')
})