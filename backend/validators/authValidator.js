const {body} = require('express-validator');

const validateRegister = [
    body('username').trim().notEmpty().withMessage('do not leave blanks!'),
    body('email').trim().isEmail().withMessage('invalid email!'),
    body('pass').isLength({min: 6}.withMessage('invalid password length!'))
];

const validateLogin = [
    body('email').trim().isEmail.withMessage('invalid email'),
    body('pass').isLength({min: 6}.withMessage('password must include more than 6 characters!'))
];

module.exports = {
    validateLogin,
    validateRegister
}