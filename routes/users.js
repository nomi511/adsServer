const express = require('express')
const router = express.Router()
const {getAllUsers, getSingleUser, registerUser, loginUser, updateUser, deleteUser, profileData} = require('../controllers/users')
const {validateRegistration, validateLogin, userValidation} = require('../middlewares/validation/user')
const {isAuthenticated} = require('../middlewares/auth')

const uploads = require('../helper/multer')












router.route('/').get(isAuthenticated, getAllUsers)
router.route('/register').post(validateRegistration, userValidation, registerUser)
router.route('/login').post(validateLogin, userValidation, loginUser)
router.route('/:id').get(isAuthenticated, getSingleUser).patch(updateUser).delete(deleteUser)


// profile image
router.route('/profile-Data').post(isAuthenticated, uploads.fields([{name: 'image', maxCount: 1}, {name:'carRegPicture', maxCount: 1}, {name: 'license', maxCount: 1}, {name: 'carImage', maxCount: 1}]), profileData)



module.exports = router