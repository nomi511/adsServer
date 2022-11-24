
require('./db/connect')
const express = require('express')
const users = require('./routes/users')
const campaigns = require('./routes/campaign')
const activeCampaigns = require('./routes/activeCampaign')
require('dotenv').config()
const rateLimit = require('express-rate-limit')
const app = express()


app.use(express.json())

// app.get('/api/v1/', (req,res)=>{
//     res.send("wow requested")
// })


// api requests limit
app.use(rateLimit({
        windowMs: 1 * 60 * 60 * 1000,
        max: 50,
        message: {success: false, message: 'Too many requests please try again after One Hour.'},
        headers: true
    })
)

// users route
app.use('/api/v1/users', users)

// campaign route
app.use('/api/v1/campaign', campaigns)

// active campagins route
app.use('/api/v1/activeCampaign', activeCampaigns)



const port = process.env.PORT
app.listen(port,()=>{
    console.log(` Server listening on port ${port}...`)
})