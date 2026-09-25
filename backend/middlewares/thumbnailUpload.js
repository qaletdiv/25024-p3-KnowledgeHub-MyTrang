const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/thumbnails');
    },
    filename: function(req,file,cb){
        const ext = path.extname(file.originalname);
        const name = `thumbnail_${req.params.id}${ext}`;
        cb(null,name);
    }
});

const filterFile = (req,file,cb)=>{
    if(!file.mimetype.startsWith('image/')){
        return cb(new Error('invalid file'), false);
    }
    cb(null,true);
};

const thumbnailUpload = multer({
    storage: storage,
    fileFilter: filterFile,
    limits: {fileSize: 2*1024*1024}
});

module.exports = thumbnailUpload;