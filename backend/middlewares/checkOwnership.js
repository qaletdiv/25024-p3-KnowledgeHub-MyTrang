const { Model } = require('sequelize');
const db = require('../models');

const checkOwnership = async (req,res,next)=>{
    const userId = req.session.userId;
    const post = await db.Posts.findByPk(req.params.id);
    if(userId !== post.userId){
        return res.status(400).json({message: 'you r not the owner of this post!'});
    }
    next();
}

module.exports = checkOwnership;