const {body} = require('express-validator')

const postValidator = [
    body('title')
        .notEmpty()
        .isLength({max: 255})
        .withMessage('invalid title'),
    body('content')
        .notEmpty()
        .withMessage('do not leave blank!')
];

module.exports = postValidator;