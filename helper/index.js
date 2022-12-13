
const crypto = require('crypto')
const nodemailer = require('nodemailer')
require('dotenv').config({path:__dirname+'/../.env'})


exports.createRandomBytes = () => new Promise((resolve, reject)=>{
    crypto.randomBytes(30, (err, buff)=>{
        if(err){
            reject(err)
        }

        const token = buff.toString('hex')
        resolve(token)
    })
})


exports.generateOTP = () =>{
    let OTP = ''
    for(let i = 0; i<=5; i++){
        const randvals = Math.round(Math.random()*9)
        OTP = OTP+randvals
    }
    return OTP
}


exports.transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth:{
        user: 'contactawlasolutions@gmail.com',
        pass: process.env.GMAIL_PASS
    }
});
