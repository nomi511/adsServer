const {isvalidObjectId} = require('mongoose')
const User = require('../models/user')
const ResetToken = require('../models/resetToken')


exports.isResetTokenValid = async(req, res, next)=>{
    const {token, id} = req.query
    if(!token || !id) {
        return res.json({success: false, message: 'Invalid Request!'})
    }


    if(!isvalidObjectId(id)){
        return res.json({success: false, message: 'Invalid User!'})
    }

    const user = await User.findOne(id)
    if(!user){
        return res.json({success: false, message: 'User not found!'})
    }

    const resetToken = await ResetToken.findOne({owner: user._id});
    if(!resetToken){
        return res.json({success: false, message: 'Reset Token not found!'})
    }

    const isValid = await ResetToken.compareToken(token)
    if(!isValid){
        return res.json({success: false, message: 'Reset Token invalid!'})
    }

    req.user = user

    next()

}