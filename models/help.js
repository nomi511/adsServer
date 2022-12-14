const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId
const User = require('./user')


const helpSchema = new Schema({
    owner: {
        type: ObjectId,
        ref: User,
        required: true
    },
    subject: String,
    details: String,
    resolved: {
        type: Boolean,
        default: false,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('UserHelp', helpSchema)