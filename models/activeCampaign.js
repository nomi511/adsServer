const User = require('./user')
const Campagin = require('./campaign')
const mongoose = require('mongoose')
const { Decimal128 } = require('mongodb')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId


const activeCampaignSchema = new Schema({
    userID:{
        type: ObjectId,
        ref: User
    },
    campaignID: {
        type: ObjectId,
        ref: Campagin
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    daysRemaining: Number,
    dailyDistance: Number,
    totalDistance: Number,
    totalIncome: Number,
    dailyRoutes: [{
        type: Object
    }],

})


module.exports = mongoose.model('ActiveCampaign', activeCampaignSchema)