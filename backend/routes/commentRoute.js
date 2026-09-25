const express = require('express');
const router = express.Router({ mergeParams: true });
const commentControlers = require('../controllers/commentController');
const requireLogin = require('../middlewares/requireLogin');
const commentValidation = require('../validators/commentValidation');
const handleValidation = require('../validators/handleValidation');
const checkCommentOwner = require('../middlewares/checkCommentOwner');

router.post('/:postId',requireLogin,commentValidation,handleValidation,commentControlers.createComment);
router.put('/:commentId', requireLogin,checkCommentOwner,commentValidation,handleValidation,commentControlers.updateComment);
router.delete('/:commentId',requireLogin,checkCommentOwner,commentControlers.deleteComment);

module.exports = router;