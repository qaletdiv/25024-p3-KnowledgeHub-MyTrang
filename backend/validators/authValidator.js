const {body} = require('express-validator');

const validateRegister = [
    body('username')
        .notEmpty().withMessage('do not leave blank!')
        .trim()
        .notEmpty().withMessage('do not leave blanks!'),
    body('email')
        .notEmpty().withMessage('do not leave blank!')
        .isEmail().withMessage('invalid email!'),
    body('password')
        .notEmpty().withMessage('do not leave blank!')
        .isLength({min: 6}).withMessage('invalid password length!'),
    body('birth')
        .optional()
        .isDate().withMessage('invalid input! format is YYYY-MM-DD'),
    body('gender')
        .optional()
        .trim()
];

const validateLogin = [
    body('email')
        .notEmpty().withMessage('do not leave blank!')
        .isEmail().withMessage('invalid email'),
    body('password')
        .notEmpty().withMessage('do not leave blank!')
        .isLength({min: 6}).withMessage('password must include more than 6 characters!')
];

module.exports = {
    validateLogin,
    validateRegister
}