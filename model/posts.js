const mongoose = require("mongoose");
const SChema = mongoose.Schema

const postsSchema =new Schema({
    authorId: {type: Number, required: true}
})