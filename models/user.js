const { Decimal128 } = require('mongodb')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')






const userSchema = new mongoose.Schema({

    name: {
        type:String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    image: String,
    carImage: String,
    carRegPicture: String,
    license: String,
    mobile: Number,
    address: String,
    car: String,
    carModel: Number, 
    // startDate: {
    //     type: Date,
    //     default: Date.now
    // },
    city:String,
    totalIncome:Number,
    totalDistance: Decimal128,
    totalDistanceToday: Decimal128,
    verified: Boolean,
    emailVerified: {
        type: Boolean,
        default: false,
        required: true
    }

})



userSchema.pre('save', function(next){
    if(this.isModified('password')){
        bcrypt.hash(this.password, 8, (err, hash)=>{
            if(err) return next(err)

            this.password = hash;
            next()
        })
    }
})


userSchema.methods.comparePassword = async function(password){
    if(!password) throw new Error('password is missing')

    try {

        const result = await bcrypt.compare(password, this.password)
        return result
    } catch (error) {
        console.log('Invalid password: ', error.message)
    }
}



userSchema.statics.emailInUse = async function(email){
    if(!email){
        throw new Error('Invalid email')
    }

    try {
        const user = await this.findOne({email})
        if(user) return false;

        return true
    } catch (error) {
        console.log("duplicate email: ", error.message)
        return false
    }


}


module.exports = mongoose.model('User', userSchema)