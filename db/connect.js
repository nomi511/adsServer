
const mongoose = require('mongoose')
const {MongoClient} = require('mongodb')
require('dotenv').config({path:__dirname+'/../.env'})

// const client = new MongoClient(process.env.MONGO_URI)

// client.connect()
// .then(()=>console.log('Connected to db...'))
// .catch((err)=>console.log(err))


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('Connected to db...'))
.catch((err)=>console.log(err))