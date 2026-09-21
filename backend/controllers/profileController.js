const db = require('../models');
const bcrypt = require('bcrypt');

const getProfile = async(req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'login to continue!'});
        }
        const user = await db.Users.findOne({where: {id: userId}});
        if(!user){
            return res.status(404).json({message: 'user not exist!'});
        }
        const resUser = {
            username: user.name,
            email: user.email,
            avatar: user.ava,
            gender: user.gender,
            birth: user.birth
        };
        return res.status(200).json({profile: resUser});
    }
    catch(err){
        return res.status(500).json({message: 'error connect server!'});
    }
};

const updateProfile = async (req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'login to continue!'});
        }
        const {username, email, birth, gender} = req.body;
        const user = await db.Users.findOne({where: {id: userId}});
        if(!user){
            return res.status(404).json({message: 'user not exist!'});
        }
        await user.update({
            username, 
            email,
            birth,
            gender
        });
        return res.status(200).json({message: 'update successfully!'});
    }
    catch(err){
        return res.status(500).json({message: 'error to connect server!'});
    }
}

const updateAvatar = async (req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'login to continue!'});
        }
        if(!req.file){
            return res.status(400).json({message: 'invalid image!'});
        }
        const user = await db.Users.findByPk(userId);
        const url = `uploads/avatars/${req.fileName}`
        await user.update({
            ava: url
        });
        return res.status(200).json({message: 'avatar update successfully!'});
    }
    catch(err){
        return res.status(500).json({message: 'error connect server!'});
    }
}

module.exports = {
    getProfile,
    updateProfile,
    updateAvatar
}


