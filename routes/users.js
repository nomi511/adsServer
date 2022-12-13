const express = require('express')
const router = express.Router()
const {getAllUsers, getSingleUser, registerUser, verifyEmail,loginUser, updateUser, deleteUser, profileData, forgotPassword, resetPassword, userHelp} = require('../controllers/users')
const {validateRegistration, validateLogin, userValidation} = require('../middlewares/validation/user')
const {isAuthenticated} = require('../middlewares/auth')
const {isResetTokenValid} = require('../middlewares/validateToken')

const uploads = require('../helper/multer')







router.route('/').get(isAuthenticated, getAllUsers)
router.route('/register').post(validateRegistration, userValidation, registerUser)
router.route('/verify-email').post(verifyEmail)
router.route('/login').post(validateLogin, userValidation, loginUser)
router.route('/:id').get(isAuthenticated, getSingleUser).patch(updateUser).delete(deleteUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(isResetTokenValid, resetPassword)
router.route('/verify-resetToken').get(isResetTokenValid, (req, res)=>{
    return res.json({success: true, message: ''})
})
router.route('/help').post(userHelp)


// profile image
router.route('/profile-Data').post(isAuthenticated, uploads.fields([{name: 'image', maxCount: 1}, {name:'carRegPicture', maxCount: 1}, {name: 'license', maxCount: 1}, {name: 'carImage', maxCount: 1}]), profileData)



module.exports = router