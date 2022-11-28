const {format} = require('date-fns')
const {v4: uuid} = require('uuid')
const fs = require('fs')
const path = require('path')
const fsPromises = fs.promises

const logger = async(message, file) => {
    const datetime = format(new Date(), 'yyyyMMdd/tHH:mm:ss')
    const logitem = `\n ${datetime} \t ${uuid()} \t ${message}`
    try{
        await fsPromises.appendFile(path.join(__dirname, '..','logs',file), logitem)
    }catch(err){
        console.log(err)
    }
}



module.exports = logger