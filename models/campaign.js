const mongoose = require('mongoose')



const campaignSchema = new mongoose.Schema({
    title: String,
    duration: Number,
    location: String,
    geoJson: Object,
    adImage: String,
    logo: String,
    type: String,
    dailyMinimum: Number,
    estimatedIncome: Number,
    active: Boolean
})


module.exports = mongoose.model('Campaign', campaignSchema)