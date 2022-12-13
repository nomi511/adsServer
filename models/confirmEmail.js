const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./user')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const confirmTokenSchema = new Schema({
    owner:{
        type: ObjectId,
        ref: User,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        expires: 1800,
        default: Date.now()
    }

})


confirmTokenSchema.pre('save', async function(next){
    if(this.isModified('token')){
        const hash = await bcrypt.hash(this.token, 8);
        this.token = hash
    }

    next()
})


confirmTokenSchema.methods.compareToken = async function(token){
    const result= await bcrypt.compareSync(token, this.token)
    return result;
}







module.exports = mongoose.model('ConfirmToken', confirmTokenSchema)