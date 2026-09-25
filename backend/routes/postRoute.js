const express = require('express');
const router = express.Router();
//ingredients
const postControllers = require('../controllers/postController');
const postValidator = require('../validators/postValidator');
const checkOwnership = require('../middlewares/checkOwnership');
const thumbnailUpload = require('../middlewares/thumbnailUpload');
const requireLogin = require('../middlewares/requireLogin');
const handleUploadMiddleware = require('../middlewares/handleUploadMiddleware');
const handleValidation = require('../validators/handleValidation');

router.get('/',postControllers.getAllPosts);
router.get('/:id',postControllers.getPost);
router.post('/',requireLogin,postValidator,handleValidation, postControllers.createPost);
router.put('/:id/thumbnail',requireLogin, checkOwnership,handleUploadMiddleware.handleUploadThumbnail,postControllers.updateThumbnail)
router.put('/:id',requireLogin,checkOwnership,postValidator,handleValidation,postControllers.updatePost);
router.delete('/:id',requireLogin,checkOwnership,postControllers.deletePost);

module.exports = router;