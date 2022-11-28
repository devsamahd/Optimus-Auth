const mysql = require('mysql')
const mongoose = require('mongoose')
require('dotenv').config()

const sqlConnection = mysql.createConnection({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: 'vyrally'
        })




const mongoConnection =()=> {
    sqlConnection.connect((err) =>{
        if(err) return console.log(err)
        try{
            mongoose.connect(process.env.DATABASE_URI, {
                useUnifiedTopology: true,
                useNewURLParser: true
            })
        }catch(err){
            console.log(err)
        }
    })    
}




module.exports = {sqlConnection, mongoConnection}