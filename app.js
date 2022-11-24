
require('./db/connect')
const express = require('express')
const users = require('./routes/users')
const campaigns = require('./routes/campaign')
const activeCampaigns = require('./routes/activeCampaign')
require('dotenv').config()

const app = express()


app.use(express.json())

// app.get('/api/v1/', (req,res)=>{
//     res.send("wow requested")
// })

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