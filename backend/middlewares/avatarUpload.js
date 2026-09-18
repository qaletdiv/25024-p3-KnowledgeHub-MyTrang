const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'uploads/avatars');
    },
    filename: function(req,file,cb){
        const ext = path.extname(file.originalname);
        const newName = `${req.session.userId}_avatar_${Date.now()}${ext}`;
        cb(null,newName);
    }
});

const filterFile = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true);
    } else{
        cb(new Error('just allow images!'), false);
    }
}

const avatarUpload = multer({
    storage: storage,
    fileFilter: filterFile,
    limits: {fileSize: 2*1024*1024}
});

module.exports = avatarUpload;

