const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const taskRoutes = require('./routes/task');
const socket = require('./utils/socket')
const { corsOptions } = require('./config/cors');

const PORT = 5000;

const app = express();

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(morgan('tiny'));

app.use(cors(corsOptions));

const server = http.createServer(app);

const io = socketIo(server, { cors: corsOptions });

socket(io);

app.use('/users', userRoutes);

app.use('/auth', authRoutes);

app.use('/messages', chatRoutes);

app.use('/tasks', taskRoutes);
app.get('/', (req, res) => res.send('<h1>Server is running!</h1>'));

server.listen(PORT, console.log('Server is running on port: ' + PORT));