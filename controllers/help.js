const UserHelp = require('../models/help')


const newHelp = async(req, res)=>{

    const {owner, subject, details} = req.body;
    if(!owner||!subject || !details){
        res.json({success: false, message: 'Missing fields! Please fill out every field'})
    }

    try {
        const help = await UserHelp.create(req.body)
        res.json({success: true, message: 'Success!'})
    } catch (error) {
        res.json({succes: false, message: `Server Error! message: ${error}`})
    }
    
}


const getSingleHelp = async(req,res)=>{
    const {id}= req.params
    try {
        const help = await UserHelp.findOne({id})
        res.json({success: true, message: help})
    } catch (error) {
        res.json({succes: false, message: `Error getting HelpForm from server! Message: ${error}`})
    }
}


const allHelps = async(req,res)=>{
    
    try {
        const helps = await UserHelp.find()
        res.json({success: true, message: helps})
    } catch (error) {
        res.json({succes: false, message: 'Error getting HelpForms from server!!'})
    }
}


const updateHelp = async(req, res)=>{
    const {id} = req.params

    try {
        await UserHelp.findByIdAndUpdate(id, {resolved:true})
        res.json({success: true, message: 'Resolved Successfully!'})
    } catch (error) {
        res.json({success: false, message: `Couldn't resolve! Message: ${error}`})
    }
}


const deleteHelp = async(req,res)=>{
    const {id}= req.params
    try {
        const help = await UserHelp.findByIdAndDelete(id)
        if(help){
            res.json({success: true, message:'Successfully deleted HelpForm'})
        }else{
            throw new Error('HelpForm not found')
        }
    } catch (error) {
        res.send({success: false,message:`Failed to delete HelpForm! ${error}`})
    }
}



module.exports = {
    newHelp,
    getSingleHelp,
    allHelps,
    updateHelp,
    deleteHelp
}