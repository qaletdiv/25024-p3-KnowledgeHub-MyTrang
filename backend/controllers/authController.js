const bcrypt = require('bcrypt');
const db = require('../models');

const SALT = 10;

const register = async(req,res)=>{
    try{
        const {username, email, gender,birth,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message: "do not leave blanks!"});
        }
        const user_email = await db.Users.findOne({where: {email}});
        if(user_email){
            return res.status(401).json({message: "existing email!"});
        }

        const pass = await bcrypt.hash(password,SALT);
        const new_user = await db.Users.create({
            username,
            email,
            password: pass,
            gender,
            birth
        });

        return res.status(200).json({message: "register successfully!"});
    }
    catch(err){
        return res.status(500).json({message: "error connecting!", error: err});
    }
}

const login = async(req,res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "do not leave blanks!"});
        }
        const user = await db.Users.findOne({where: {email}});
        if(!user){
            return res.status(401).json({message: "user not exist!"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "login failed!"});
        }
        req.session.userId = user.id;
        return res.status(200).json({message: "login successfully!"})
    }
    catch(err){
        return res.status(500).json({message:"error connecting!", error: err});
    }
}

const logout = async(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).json({message: "server error!"});
        }
        res.clearCookie('connect.sid',{
            httpOnly: true,
            sameSite: 'strict',
            secure: false
        });
        return res.status(200).json({ message: 'Logout successful' });
    })
}

const changePass = async(req,res)=>{
    try{
        const {email, newPass} = req.body;
        const user = await db.Users.findOne({where: {email}});
        if(!user){
            return res.status(404).json({message: 'user not exist!'});
        }
        const changedPass = await bcrypt.hash(newPass, 10);
        await user.update({
            password: changedPass
        });
        return res.status(200).json({message: 'password changed!'});
    }
    catch(err){
        return res.status(500).json({message: 'error connect server!'});
    }
};

module.exports = {
    register,
    login,
    logout,
    changePass
}