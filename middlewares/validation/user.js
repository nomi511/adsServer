
const {check, validationResult} = require('express-validator')

exports.validateRegistration = [
    check('name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Name cannot be empty')
        .isString()
        .withMessage('Name must be a valid value')
        .isLength({min:3, max: 50})
        .withMessage('Name Must be within 3 to 50 characters'),
    check('email').normalizeEmail().isEmail().withMessage('Invalid email'),
    check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Password is empty')
        .isLength({min: 8})
        .withMessage('Password must be 8 characters long')

]

exports.userValidation = (req, res, next)=>{
    const result = validationResult(req).array();
    if(!result.length)return next();

    const error = result[0].msg;
    res.json({success: false, message: error})
}




exports.validateLogin = [
    check('email').trim().isEmail().withMessage('Invalid email'),
    check('password').trim().not().isEmpty().withMessage('password is emtpy')
]