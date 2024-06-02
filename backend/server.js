const express = require('express');
const morgan = require('morgan')
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const PORT = 5000;

const app = express();


app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(morgan('tiny'));

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.get('/', (req, res) => res.send('<h1>Hello Express</h1>'));



app.listen(PORT, console.log('Server is running on port: ' + PORT));