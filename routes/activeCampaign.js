const express = require('express')
const router = express.Router()
const {
    getAllActiveCampaigns,
    getSingleActiveCampaign,
    updateActiveCampaign,
    createActiveCampaign,
    deleteActiveCampaign,
    updateDailyRoute
} = require('../controllers/activeCampaign')



router.route('/').get(getAllActiveCampaigns).post(createActiveCampaign)
router.route('/dailyroutes/:id').patch(updateDailyRoute)
router.route('/:id').get(getSingleActiveCampaign).patch(updateActiveCampaign).delete(deleteActiveCampaign)

module.exports = router