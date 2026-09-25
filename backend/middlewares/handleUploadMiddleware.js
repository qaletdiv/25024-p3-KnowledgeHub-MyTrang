const avatarUpload = require("./avatarUpload")
const thumbnailUpload = require('./thumbnailUpload')
const handleUploadAvatar = (req,res,next)=>{
    const upload = avatarUpload.single('avatar');
    upload(req,res,(err)=>{
        if(err){
            return res.status(400).json({message: err.message});
        }
        next();
    })
}

const handleUploadThumbnail = (req,res,next)=>{
    const upload = thumbnailUpload.single('thumbnail');
    upload(req,res,(err)=>{
        if(err){
            return res.status(400).json({message: err.message});
        }
        next();
    })
}

module.exports = {
    handleUploadAvatar,
    handleUploadThumbnail
};