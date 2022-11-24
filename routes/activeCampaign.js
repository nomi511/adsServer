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
const {isAuthenticated} = require('../middlewares/auth')



router.route('/').get(getAllActiveCampaigns).post(isAuthenticated, createActiveCampaign)
router.route('/dailyroutes/:id').patch(isAuthenticated, updateDailyRoute)
router.route('/:id').get(getSingleActiveCampaign).patch(updateActiveCampaign).delete(deleteActiveCampaign)

module.exports = router