const express = require('express')
const router = express.Router();
const {
    newHelp,
    getSingleHelp,
    allHelps,
    updateHelp,
    deleteHelp
} = require('../controllers/help')


router.route('/').get(allHelps).post(newHelp);
router.route('/:id').get(getSingleHelp).patch(updateHelp).delete(deleteHelp);


module.exports = router