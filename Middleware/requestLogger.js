const EventEmmitter = require('events')
const logger = require('../Controllers/logger')

class TheEmmitter extends EventEmmitter{};

const theEmmitter = new TheEmmitter()
theEmmitter.on('log', (msg)=> logger(msg, 'reqlogger.txt'))
const requestLogEng = (req, res, next)=>{
    const message = `${req.url} \t ${req.headers.origin} \t ${req.method}`
    theEmmitter.emit('log', message)
    next()
}


module.exports = requestLogEng