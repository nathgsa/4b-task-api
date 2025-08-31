const express = require('express')
const cors = require('cors')
const taskRoute = require('./routes/task.route')
const connectDB = require('./config/db.config')

const app = express();

// check database connection
connectDB();

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api', taskRoute)

app.get('/', (req, res)=>{
    res.send('Welcome to my express API')
})

module.exports = app;