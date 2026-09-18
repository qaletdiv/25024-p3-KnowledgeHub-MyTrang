const avatarUpload = require("./avatarUpload")

const handleAvatar = (req,res)=>{
    const upload = avatarUpload.single('avatar');
    upload(req,res,(err)=>{
        if(err){
            return res.status(400).json({message: err.message});
        }
        next();
    })
}

module.exports = handleAvatar;