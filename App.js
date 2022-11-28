const express = require('express')
const corsoptions = require('./Config/corsoptions')
const requestLogEng = require('./Middleware/requestLogger')
const App = express()
const PORT = process.env.PORT || 122
const path = require('path')
const ErrorLogEng = require('./Middleware/errorLogger')
const cors = require('cors')
const {mongoConnection} = require('./Config/dbconnect')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

mongoConnection()


App.use(cors(corsoptions))
App.use(requestLogEng)

App.use(express.urlencoded({extended: false}))
App.use(express.json())
App.use(express.static(path.join(__dirname, '/public')))
App.use(cookieParser())




App.use('/user', require('./Routes/users'))

App.use(ErrorLogEng)

mongoose.connection.once('open', async()=>{
    App.listen(PORT,()=>{
        console.log("Databases connected")
        console.log('listening on PORT', PORT)
    })
})
