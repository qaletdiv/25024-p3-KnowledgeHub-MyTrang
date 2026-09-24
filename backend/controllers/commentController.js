const db = require('../models');


const createComment = async(req,res)=>{
    try{
        const {content} = req.body;
        const post = await db.Posts.findByPk(req.params.id);
        if(!post){
            return res.status(400).json({message:'post does not exist!'});
        }
        await db.Comments.create({
            post_id: post.id,
            user_id: req.session.userId,
            content: content
        });
        return res.status(200).json({message: 'comment sucessfully!'})
    }
    catch(Err){
        return res.status(500).json({message: 'server error connection'})
    }
}

const updateComment = async(req,res)=>{
    try{
        const {content} = req.body;
        const comment = await db.Comments.findByPk(req.params.commentId);
        if(!comment){
            return res.status(400).json({message: 'comment does not exist!'});
        }
        await comment.update({
            content
        })
        return res.status(200).json({message: 'update successfully!'});
    }
    catch(err){
        return res.status(500).json({message: 'server error connection!'});
    }
}

const deleteComment = async(req,res)=>{
    try{
        const comment = db.Comments.findByPk(req.params.commentId);
        if(!comment){
            return res.status(400).json({message: 'comment does not exist!'});
        }
        await comment.destroy();
        return res.status(200).json({message: 'delete succesfully!'});
    }
    catch(err){
        return res.status(500).json({message: 'server connection error!'});
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment
}