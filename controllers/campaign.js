const Campaign = require('../models/campaign')
const cloudinary = require('../helper/imageUpload')



const getAllCampaigns = async(req,res)=>{
    try {
        const cmps = await Campaign.find()
        res.json({success:true, message: cmps})
    } catch (error) {
        res.send({success: false, message: 'Failed to get all campaigns'})
    }
    
}

const getSingleCampaign = async(req,res)=>{
    const id = req.params.id
    try {
        const cmp = await Campaign.findById(id)
        res.json({success:true, message: cmp})
    } catch (error) {
        res.send({success: false, message: 'Failed to get campaign'})
    }
}

const createCampaign = async(req,res)=>{

    const {user} = req

    if(!user) return res.status(401).json({success: false, message: 'Unauthorised access!'})

    try {

        const files = req.files

        const adimg = new Promise((resolve, reject)=>{
            const adImage = cloudinary.uploader.upload(files.adImage[0].path,{
                public_id: `${user._id}_adImage`,
                width: 500,
                height: 500,
                crop: 'fill'
            })

            if(adImage){
                resolve(adImage)
            }else{
                reject('Error uploading image')
            }
        })


        const logoimg = new Promise((resolve, reject)=>{
            const logo = cloudinary.uploader.upload(files.logo[0].path,{
                public_id: `${user._id}_logo`,
                width: 500,
                height: 500,
                crop: 'fill'
            })

            if(logo){
                resolve(logo)
            }else{
                reject('Error uploading image')
            }
        })


        const data = await Promise.all([adimg, logoimg]).then((val)=>{
            return {
                title: req.body.title,
                duration: req.body.duration,
                location: req.body.location,
                geoJson: req.body.geoJson,
                adImage: val[0].url,
                logo: val[1].url,
                type: req.body.type,
                dailyMinimum: req.body.dailyMinimum,
                estimatedIncome: req.body.estimatedIncome,
                active: false
            }
        })

        await Campaign.create(data)

        res.status(200).json({success: true, message: 'Campagin successfully created!'})

        
    } catch (error) {
        res.json({success: false, message: 'Error creating campaign! try again later'})
    }

}

const updateCampaign = async(req,res)=>{
    const id = req.params.id
    const data = req.body
    try {
        const cmp = await Campaign.findByIdAndUpdate(id, data)
        if(cmp){
            res.json({success:true, message: 'Successfully updated campaign'})
        }else {
            res.json({success: false, message: 'Campaign not found!'})
        }
        
    } catch (error) {
        res.send({success: false, message: 'Failed to update campaign'})
    }
} 

const deleteCampaign = async(req,res)=>{
    const {id} = req.params
    try {
        await Campaign.findByIdAndDelete(id)
        res.json({success:true, message: 'Successfully deleted campaign'})
    } catch (error) {
        res.send({success: false, message: 'Failed to delete campaign'})
    }
}



module.exports = {
    getAllCampaigns,
    getSingleCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
}