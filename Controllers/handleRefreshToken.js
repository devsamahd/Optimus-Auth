const User = require("../model/users")
const jwt = require('jsonwebtoken')
require('dotenv').config()


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({message: "unauthorized"})

    const rt = cookies.jwt

    const found =await User.findOne({refreshToken: rt}).exec()
    if(!found) return res.sendStatus(403) //forbidden

    jwt.verify(
        found.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || found.username !== decoded.username) return res.sendStatus(403)
            const accessToken = jwt.sign(
                {username: decoded.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '5m'}
            )
            res.json({accessToken})
        }
    )
}

module.exports = handleRefreshToken