const { Model } = require('sequelize');
const db = require('../models');

const checkOwnership = async (req,res,next)=>{
    try{
        const userId = req.session.userId;
        const post = await db.Posts.findByPk(req.params.id);
        if(!post){
            return res.status(400).json({message: 'post does not exist!'});
        }
        if(userId !== post.userId){
            return res.status(400).json({message: 'you r not the owner of this post!'});
        }
        next();
    }
    catch(err){
        return res.status(500).json({message: 'server connection error!'});
    }
}

module.exports = checkOwnership;