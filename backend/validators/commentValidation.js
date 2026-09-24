const {body} = require('express-validator');

const commentValidation = [
    body['content']
        .notEmpty().withMessage('do not leave blank!') 
        .trim()    
]

module.exports = commentValidation