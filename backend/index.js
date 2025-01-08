const cors = require('cors');
const express = require('express');
const http = require('http');
const { configureSocket } = require('./config/socketconfig');
const connectToDB = require('./controllers/database/dbconnect');
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

const app = express();
const server = http.createServer(app);
configureSocket(server);




app.use(
    cors({
        origin: "http://localhost:5173",
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
// connect to the database
connectToDB();

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


server.listen(3000, () => { console.log('sever listening on 3000') })