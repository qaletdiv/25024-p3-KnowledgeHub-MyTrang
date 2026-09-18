const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const {handleValidation} = require('../validators/handleValidation');
const {requireLogin} = require('../middlewares/requireLogin');

router.post('/register',authValidator.validateRegister,handleValidation,authControllers.register);
router.post('/login',authValidator.validateLogin,handleValidation,authControllers.login);
router.post('/logout', requireLogin,authControllers.logout);
router.put('/forget', authControllers.changePass);

module.exports = router;