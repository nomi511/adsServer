const User = require('../models/user')
const jwt = require('jsonwebtoken')
const cloudinary = require('../helper/imageUpload')


// email reset
const ResetToken = require('../models/resetToken')
const {createRandomBytes} = require('../helper')
//---------------


// confirm email
const {generateOTP} = require('../helper')
const ConfirmToken = require('../models/confirmEmail')
const {isValidObjectId} = require('mongoose')


// transporter for sending emails using gmail
const {transporter} = require('../helper')



const getAllUsers = async(req, res)=>{
    try {
        const users = await User.find()
        res.json({success: true, message: users})
    } catch (error) {
        res.json({succes: false, message: 'error getting users from server!!'})
    }
}


const getSingleUser = async(req,res) =>{
    const id = req.params.id
    try {
        const users = await User.find({id})
        res.json({success: true, message: users})
    } catch (error) {
        res.json({succes: false, message: 'error getting user from server!!'})
    }
    
}

const registerUser = async(req, res)=>{
    const {email} = req.body
    const isDuplicateEmail = await User.emailInUse(email)
    if(!isDuplicateEmail){
        return res.json({
            success: false,
            message: 'This email is already in use, try again with another email.'
        })
    }

    const newUser = new User(req.body)
    

    const OTP = generateOTP()

    const verificationToken = new ConfirmToken({owner: newUser._id, token: OTP})
    
    await verificationToken.save();
    await newUser.save();


    const mailOptions = {
        form: `contactawlasolutions@gmail.com`,
        to: 'nk515605@gmail.com',
        subject: 'Email verification',
        text: `Your confirmation code is: ${OTP}`
    }
    
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            res.json({success:false, message: 'Error sending email'})
        }else{
            console.log('success: ', info)
            res.json({success: true, message: 'Confirmation code is sent to your email address.'})
        }
        
    })

    //const token = jwt.sign({userID: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
    //res.status(201).json({success: 'true', message: token})
}

const verifyEmail = async(req,res)=>{
    const {userID, OTP} = req.body

    if(!userID || !OTP.trim()){
        return res.json({success: false, message: 'Invalid Request!, Missing parameters'})
    }

    if(!isValidObjectId(userID)){
        return res.json({success: false, message: 'Invalid user id!'})
    }

    const user = await User.findById(userID)
    if(!user){
        return res.json({success:false, message: 'No user found!'})
    }

    if(user.emailVerified){
        return res.json({success:false, message: 'User email already verified!'})
    }

    const token = await ConfirmToken.findOne({owner: user._id})
    if(!token){
        return res.json({success: false, message: 'Sorry! User not found! Register again.'})
    }


    const isMatch = await token.compareToken(OTP)

    if(!isMatch){
        return res.json({success: false, message: 'The token does not match! Please provid a valid token.'})
    }

    await User.findByIdAndUpdate(userID, {emailVerified: true})
    await ConfirmToken.findByIdAndDelete(token._id);

    const mailOptions = {
        form: `contactawlasolutions@gmail.com`,
        to: 'nk515605@gmail.com',
        subject: 'Email Verification',
        text: `Email verified successfully.`
    }
    
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            res.json({success:false, message: 'Error sending email'})
        }else{
            console.log('success: ', info)
            res.json({success: true, message: 'Email verified successfully.'})
        }
        
    })



}

const loginUser = async(req, res)=>{
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) return res.json({success: false, message:'user not found. Enter a valid email'})

    const isMatch = await user.comparePassword(password)
    if(!isMatch) return res.json({succes: false, message: 'password is incorrect'})


    const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

    res.json({success:true, message: token})

}

const updateUser = async(req, res)=>{
    const id = req.params.id
    const data = req.body
    try {
        const user = await User.findByIdAndUpdate(id, data)
        if(user){
            res.json({success: true, message:'User updated successfully'})
        }else{
            res.json({success: false, message: 'User not found!'})
        }
        
    } catch (error) {
        res.send({success: false, message:`Failed to update user! ${error}`})
    }
    
}

const deleteUser = async(req, res)=>{
    const id = req.params.id
    try {
        const user = await User.findByIdAndDelete(id)
        if(user){
            res.json({success: true, message:'Successfully deleted user'})
        }else{
            throw new Error('User not found')
        }
    } catch (error) {
        res.send({success: false,message:`Failed to delete user! ${error}`})
    }
}

 const profileData = async(req,res)=>{
    const {user} = req
    
    if(!user) return res.status(401).json({success: false, message: 'Unauthorise access!'})

    try {

        const files = req.files;

        const img = new Promise((resolve, reject)=>{
            const upImg = cloudinary.uploader.upload(files.image[0].path,{
                public_id: `${user._id}_image`,
                width: 500,
                height: 500,
                crop: 'fill'
            })


            if(upImg){
                resolve(upImg)
            }else{
                reject('Error uploading image.')
            }

        })


        const carImg = new Promise((resolve, reject)=>{
            const upImg = cloudinary.uploader.upload(files.carImage[0].path,{
                public_id: `${user._id}_car`,
                width: 500,
                height: 500,
                crop: 'fill'
            })

            if(upImg){
                resolve(upImg)
            }else{
                reject('Error uploading image.')
            }

        })
    
    
        const reg = new Promise((resolve, reject)=>{
            const upImg = cloudinary.uploader.upload(files.carRegPicture[0].path,{
                public_id: `${user._id}_carRegPicture`,
                width: 500,
                height: 500,
                crop: 'fill'
            })

            if(upImg){
                resolve(upImg)
            }else{
                reject('Error uploading image.')
            }

        })

        const li = new Promise((resolve, reject)=>{
            const upImg = cloudinary.uploader.upload(files.license[0].path,{
                public_id: `${user._id}_license`,
                width: 500,
                height: 500,
                crop: 'fill'
            })

            if(upImg){
                resolve(upImg)
            }else{
                reject('Error uploading image.')
            }

        })

        const data = await Promise.all([img, reg, li, carImg]).then((val)=>{

            return {
                image: val[0].url,
                carRegPicture: val[1].url,
                license: val[2].url,
                carImage: val[3].url,
                mobile: req.body.mobile,
                address: req.body.address,
                car: req.body.car,
                carModel: req.body.carModel,
                city: req.body.city,
                totalIncome: 0,
                totalDistance: 0,
                totalDistanceToday: 0,
                verified: false
            }
        })
       

        const updates = await User.findByIdAndUpdate(user._id, data)
        if(updates){
            res.status(201).json({success: true, message: 'Profile image has updated!'})
        }else{
            res.json({success: false, message: 'User not found!'})
        }
        
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error. Try again'})
        console.log("Error uploading image. ", error.message) 
    }
 
}

const forgotPassword = async(req,res)=>{
    const {email} = req.body
    if(!email){
        req.json({
            success: false,
            message: 'Please provide email!'
        })
    }

    const user = await User.findOne({email})

    if(!user){
        res.json({success: false, message: 'User not found!'})
    }

    const token = await ResetToken.findOne({owner: user._id})
    if(token){
        res.json({success: false, message: 'Please wait for 30 minutes before trying again.'})
    }

    const newToken = await createRandomBytes()

    const resetToken = await ResetToken.create({owner: user._id, token: newToken})

    
    
    const mailOptions = {
        form: `contactawlasolutions@gmail.com`,
        to: 'nk515605@gmail.com',
        subject: 'Password Reset',
        text: `this is your link to reset the passwor\n\n\t LINK: http://localhost:3000/reset-password?token=${newToken}&id=${user._id}`
    }
    
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            res.json({success:false, message: 'Error sending email'})
        }else{
            console.log('success: ', info)
            res.json({success: true, message: 'Email sent successfully.'})
        }
        
    })
    

}

const resetPassword = async(req,res)=>{
    const {password} = req.body

    const user = await User.findById(req.user._id)
    if(!user){
        return res.json({success: false, message: 'User not found!'})
    }

    const isSamePassword = await user.comparePassword(password)
    if(isSamePassword){
        return res.json({success: false, message: 'New password must be different from the current one.'})
    }

    if(password.trim().length<8){
        return res.json({success: false, message: 'Password must be atleast 8 characters long!'})
    }


    user.password = password.trim()
    await user.save()

    await ResetToken.findOneAndDelete({owner: user._id})

    const mailOptions = {
        form: `contactawlasolutions@gmail.com`,
        to: 'nk515605@gmail.com',
        subject: 'Password Changed',
        text: `Password changed successfully.`
    }
    
    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error)
            res.json({success:false, message: 'Error sending email'})
        }else{
            console.log('success: ', info)
            res.json({success: true, message: 'Password reset and Email sent successfully.'})
        }
        
    })


}


const userHelp = async(req,res)=>{
    
}


module.exports = {
    getAllUsers,
    getSingleUser,
    registerUser,
    verifyEmail,
    loginUser,
    updateUser,
    deleteUser,
    profileData,
    forgotPassword,
    resetPassword,
    userHelp
}