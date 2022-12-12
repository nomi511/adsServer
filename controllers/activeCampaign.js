const ActiveCampaign = require('../models/activeCampaign')


const getAllActiveCampaigns = async(req, res)=>{
    try {
        const actives = await ActiveCampaign.find()
        res.json({success: 'true', message: actives})
    } catch (error) {
        res.json({success: false, message: 'Failed to get all active campaigns'})
    }
}



const getSingleActiveCampaign = async(req, res)=>{
    const {id} = req.params
    try {
        const value = await ActiveCampaign.findById(id)
        res.json({success:true, message: value})
    } catch (error) {
        res.json({success: false, message: 'Failed to get active campaign! try again'})
    }
}



const createActiveCampaign = async(req, res)=>{
    const data = req.body
    try {
        const cmp = await ActiveCampaign.create(data)
        res.json({success: true, message: "Successfully joined a campaign"})
    } catch (error) {
        res.json({success: false, message: 'Failed to join campaign! Please try again'})
    }
}



const updateActiveCampaign = async(req, res)=>{
    const {id} = req.params
    const data = req.body
    try {
        const ncmp = await ActiveCampaign.findByIdAndUpdate(id, data)
        if(ncmp){
            res.json({success: true, message: 'Successfully updated active campaign!'})
        }else{
            res.json({success:false, message: 'Active campagin not found!'})
        }
        
    } catch (error) {
        res.json({success: false, message: 'Failed to updated active campaign! Please try again.'})
    }
}


const updateDailyRoute = async(req,res) => {
    const {id} = req.params
    const reqData = req.body
    try {
        const data = await {
            time: (new Date()),
            coords: reqData.dailyRoutes.coords
        }
        const ncmp = await ActiveCampaign.updateOne(
            {_id: id},
            {
                $push:{dailyRoutes: data}
            }
        )
        if(ncmp){
            res.json({success: true, message: 'Successfully updated daily route.'})
        }else{
            res.json({success: false, message: 'Active Campaign not found!'})
        }
        
    } catch (error) {
        res.json({success: false, message: 'Failed to updated daily route! Please try again.'})
    }
}



const deleteActiveCampaign = async(req, res)=>{
    const {id} = req.params
    try {
        const value = await ActiveCampaign.findByIdAndDelete(id)
        res.json({success: true, message: 'Successfully deleted active campaign!'})
    } catch (error) {
        res.json({success: false, message: 'C.ould not delete active campaign! try again later'})
    }
}



module.exports= {
    getAllActiveCampaigns,
    getSingleActiveCampaign,
    updateActiveCampaign,
    createActiveCampaign,
    deleteActiveCampaign,
    updateDailyRoute
}