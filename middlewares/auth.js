const jwt = require('jsonwebtoken')
const User = require('../models/user')


exports.isAuthenticated = async(req, res, next) => {

    if(req.headers && req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1]
        
        try {
            
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decode.userID)

            if(!user){
                return res.json({success: false, message: 'Unauthorised access!'});
            }

            req.user = user
            next()

        } catch (error) {
            
            if(error.name === 'JsonWebTokenError'){
                return res.json({success: false, message: 'Unauthorised access!'});
            }
            else if(error.name === 'TokenExpiredError'){
                return res.json({success: false, message: 'Session expired. Sign in again'});
            }

            res.json({success: false, message: 'Internal server error!'});

        }

    }else{
        res.json({success: false, message: 'Unauthorised access!'});
    }

}