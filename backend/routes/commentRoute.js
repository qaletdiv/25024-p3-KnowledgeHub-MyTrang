const express = require('express');
const router = express.Router();
const commentControlers = require('../controllers/commentController');
const requireLogin = require('../middlewares/requireLogin');
const commentValidation = require('../validators/commentValidation');
const handleValidation = require('../validators/handleValidation');
const checkCommentOwner = require('../middlewares/checkCommentOwner');

router.post('/comment',requireLogin,commentValidation,handleValidation,commentControlers.createComment);
router.put('/comment/:commentId', requireLogin,checkCommentOwner,commentValidation,handleValidation,commentControlers.updateComment);
router.delete('/comment/:commentId',requireLogin,checkCommentOwner,commentControlers.deleteComment);

module.exports = router;