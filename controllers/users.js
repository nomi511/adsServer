const User = require('../models/user')
const jwt = require('jsonwebtoken')
const cloudinary = require('../helper/imageUpload')






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

    const newUser = await User.create(req.body)

    const token = jwt.sign({userID: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1d'})

    res.status(201).json({success: 'true', message: token})
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
        res.json({success: true, message:'User updated successfully'})
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
       

        await User.findByIdAndUpdate(user._id, data)
        
        res.status(201).json({success: true, message: 'Profile image has updated!'})
    } catch (error) {
        res.status(500).json({success: false, message: 'Internal server error. Try again'})
        console.log("Error uploading image. ", error.message) 
    }
 
}


module.exports = {
    getAllUsers,
    getSingleUser,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    profileData
}