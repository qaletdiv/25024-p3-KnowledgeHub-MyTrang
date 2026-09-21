const express = require('express');
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const profileControllers = require('../controllers/profileController');
const avatarUpload = require('../middlewares/avatarUpload');
const handleUploadMiddleware = require('../middlewares/handleUploadMiddleware')
const {profileValidator }= require('../validators/profileValidator');
const handleValidation = require('../validators/handleValidation')

router.get('/',requireLogin, profileControllers.getProfile);
router.put('/',requireLogin, profileValidator, handleValidation, profileControllers.updateProfile);
router.put('/avatar', requireLogin, avatarUpload.single('avatar'), handleUploadMiddleware, profileControllers.updateAvatar);

module.exports = router;