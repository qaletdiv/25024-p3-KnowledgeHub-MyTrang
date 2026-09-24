const {body} = require('express-validator');

const profileValidator = [
    body('username')
        .trim()
        .optional(),
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('invalid email!'),
    body('gender')
        .optional()
        .isLength({min: 4}).withMessage('invalid data'),
    body('birth')
        .optional()
        .isDate().withMessage('invalid data!')  
];

module.exports = {
    profileValidator
}