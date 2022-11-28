const User  = require('../model/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Ip = require('ip')
const { sqlConnection } = require('../Config/dbconnect')
require('dotenv').config()

const getAllUsers = async(req, res) => {
    const users =await User.find()
    if(!users) return res.json({message:"NO users found, the pain"})
    return res.json(users)
}


const handleNewUser = async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body
    if(![firstname, lastname, username, email, password].every(Boolean)) return res.status(400).json({message: 'All fields are required'})
    
    if(await User.findOne({username}).exec() || await User.findOne({email}).exec()) return res.sendStatus(409) //conflict

    try{
        const hashed = await bcrypt.hash(password, 10)
        const accessToken = jwt.sign(
            {username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '5m'}
        )
        const refreshToken = jwt.sign(
            {username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '5d'}
        )
        const response =await User.create({
            firstname,
            lastname,
            email,
            username,
            password: hashed,
            refreshToken
        })
        
        const {_id, firstname, lastname, email, friends, verified, username} = response
        const user = {_id, firstname, lastname, email, friends, verified, username}

        
        res.cookie('jwt', refreshToken, {httpOnly: true,secure: true, maxAge: 24 * 60 * 60 * 5000})
        return res.status(201).json({user, accessToken})
    }catch(err){
        return res.status(500). json({error: err.message})
    }
}

const handleLogin = async(req, res) => {
    const {user, password} = req.body
    if(![user, password].every(Boolean)) return res.status(400).json({type:"incompleteinfo", message: 'user login credentials required'})
    const regex = /^(\w+)[@](\w+)[.](\w+)$/
    const tester = regex.test(user) ? {email: user} : {username: user}
    const found = await User.findOne(tester).exec()
    
    if(!found) return res.sendStatus(401)

    const match = await bcrypt.compare(password, found.password)
    if(match){
        
        const checkcode = found.verified.filter(code=> code === 2019)
        if(checkcode < 1) return res.status(400).json({type:"notverified", message: "no message"})
        const ipAddress = Ip.address()
        sqlConnection.query(`SELECT * FROM devices WHERE device_ip = '${ipAddress}'`, async (err, result) => {
            if(err) return console.log(err)
            if(await result.length < 1) return res.status(400).json({type: "newdevice", message: "new device"}) 
        
            const accessToken = jwt.sign(
                {username: found.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '5m'}
            )
            const refreshToken = jwt.sign(
                {username: found.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '5d'}
            )

            found.refreshToken = refreshToken
            const response = await found.save()
            const {_id, firstname, lastname, email, friends, verified, username} = response
            const user = {_id, firstname, lastname, email, friends, verified, username}
            res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 5000})
            return res.status(201).json({user, accessToken})
        })
    }else{
        return res.status(400).json({type:"wrongpass"})
    }
    
}



module.exports = {handleNewUser, handleLogin, getAllUsers}