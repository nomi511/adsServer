const express = require('express')
const router = express.Router()
const {getAllCampaigns,
    getSingleCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign
} = require('../controllers/campaign');
const uploads = require('../helper/multer')
const {isAuthenticated} = require('../middlewares/auth')


router.route('/').get(isAuthenticated, getAllCampaigns).post(isAuthenticated,uploads.fields([{name: 'adImage', maxCount: 1},{name: 'logo', maxCount: 1}]), createCampaign)
router.route('/:id').get(isAuthenticated, getSingleCampaign).patch(isAuthenticated, updateCampaign).delete(isAuthenticated, deleteCampaign)




module.exports = router