const express = require('express');
const router = express.Router();
const {requireLogin} = require('../middlewares/requireLogin');
const profileControllers = require('../controllers/profileController');
const avatarUpload = require('../middlewares/avatarUpload');
const {handleAvatar} = require('../middlewares/handleAvatar')
const profileValidators = require('../validators/profileValidator');
const {handleValidation} = require('../validators/handleValidation')

router.get('/',requireLogin, profileControllers.getProfile);
router.put('/',requireLogin, profileValidators, handleValidation, profileControllers.updateProfile);
router.put('/avatar', requireLogin, avatarUpload, handleAvatar, profileControllers.updateAvatar);

module.exports = router;