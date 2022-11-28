const Schema = require('mongoose').Schema
const mongoose = require('mongoose')

const usersSchema = new Schema({
    firstname: { type: String, required: true},
    lastname: { type: String, required: true},
    username: { type: String, required: true},
    email:{ type: String, required: true},
    verified: [Number],
    image: String,
    password: {type: String, required: true},
    friends: [String],
    refreshToken:String
},{timestamps:true})

module.exports = mongoose.model('User', usersSchema)