const User = require("../model/users")
const sendConfirmationMail = require('../Middleware/sendConfirmEmail')
const Ip = require('ip')
const os = require('os')
const { sqlConnection } = require("../Config/dbconnect")


const sendCode = async (req, res) => {
    const { email } = req.body
    if(!email) return res.status(400).json({message: "no email"})
    const code = await sendConfirmationMail(email)
    res.json({code: code})
}

const confirmCode = async (req, res) => {
    
    const {codev, email, code} = req.body
    const verify= codev?.data?.code


    if(![email, code, verify].every(Boolean)) return res.status(400).json({message: "All fields required"})
    if(verify != code) return res.sendStatus(403)
    const found =await User.findOne({email: email}).exec()
    if(!found) return res.status(400).json({message: "User with email"+email+" not found"})


    const ipAddress = Ip.address()
    const devicename = os.hostname()
    sqlConnection.query(`insert into devices (user_id, device_ip, device_name) values ('${found._id}','${ipAddress}','${devicename}')`,async(err, result)=>{
        if(err) console.log(err)
    })

    if(found.verified.filter(code => code === 2019).length > 0) return res.json({message:"Already verified"})
    found.verified.push(2019)
    await found.save()
    res.json({message: "successfully verified"})
}

module.exports = {sendCode, confirmCode}