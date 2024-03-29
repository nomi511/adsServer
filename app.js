
require('./db/connect')
const express = require('express')
const cors = require('cors')
const users = require('./routes/users')
const campaigns = require('./routes/campaign')
const activeCampaigns = require('./routes/activeCampaign')
const userHelp = require('./routes/help')
require('dotenv').config()
const rateLimit = require('express-rate-limit')
const {isAuthenticated} = require('./middlewares/auth')
const app = express()
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors())

// api requests limit
app.use(rateLimit({
        windowMs: 1 * 60 * 60 * 1000,
        max: 50,
        message: {success: false, message: 'Too many requests please try again after One Hour.'},
        headers: true
    })
)



// body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())


// users route
app.use('/api/v1/users', users)

// campaign route
app.use('/api/v1/campaign', isAuthenticated,campaigns)

// active campagins route
app.use('/api/v1/activeCampaign', isAuthenticated,activeCampaigns)

// user help
app.use('/api/v1/user-help', userHelp)


app.get('/', (req,res)=>{
res.send('server is running......')
})


// sending email link
// app.post('/email', (req,res)=>{
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         host: "smtp.gmail.com",
//         secure: true,
//         auth:{
//             user: 'contactawlasolutions@gmail.com',
//             pass: 'ujnieovdcrhljmgz'
//         }
//     });
    
//     let mailOptions = {
//         form: `contactawlasolutions@gmail.com`,
//         to: 'thebespokeone@gmail.com',
//         subject: 'test email',
//         text: 'wow my first email from nodejs'
//     }
    
//     transporter.sendMail(mailOptions, (error, info)=>{
//         if(error){
//             console.log(error)
//             res.send('error sending email')
//         }else{
//             console.log('success: ', info)
//             res.send('email sent...')
//         }
        
//     })
    
// })






const port = process.env.PORT
app.listen(port,()=>{
    console.log(` Server listening on port ${port}...`)
})
