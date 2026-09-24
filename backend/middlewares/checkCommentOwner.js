const db = require('../models')

const checkCommentOwner = async (req,res,next)=>{
    const comment = await db.Comments.findByPk(req.params.commentId);
    if(!comment){
        return res.status(400).json({message: 'comment not found!'});
    }
    if(comment.user_id !== req.session.userId){
        return res.status(400).json({message: 'not the owner!'});
    }
    next();
}

module.exports = checkCommentOwner;