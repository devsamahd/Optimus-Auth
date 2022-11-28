const EventEmmitter = require('events')
const logger = require('../Controllers/logger')

class TheEmmitter extends EventEmmitter{};

const theEmmitter = new TheEmmitter()
theEmmitter.on('log', (msg)=> logger(msg, 'errlogger.txt'))
const ErrorLogEng = (err, req, res, next)=>{
    const message = `${err.message}`
    theEmmitter.emit('log', message)
    next()
}


module.exports = ErrorLogEng