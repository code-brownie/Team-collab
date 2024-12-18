const express = require('express');
const connectToDB = require('./controllers/database/dbconnect');
const cookieParser = require('cookie-parser')
const app = express();
const taskRoutes = require('./routes/TaskRoutes');
const userRoutes = require('./routes/UserRoutes');
const teamRoutes = require('./routes/TeamRoutes');
const projectRoutes = require('./routes/ProjectRoutes');
//middleware
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



app.listen(3000, () => { console.log('sever listening on 3000') })