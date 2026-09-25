const db = require('../models');

const getAllPosts = async(req,res)=>{
    try{
        const allPosts = await db.Posts.findAll({
            include: 
                [
                    {
                        model: db.Users, 
                        as: 'author', 
                        attributes: ['id', 'username']
                    },
                    {
                        model: db.Comments, 
                        include: 
                            [
                                {
                                    model: db.Users, 
                                    as: 'author', 
                                    attributes: ['id', 'username']
                                }
                            ],
                        as: 'comments', 
                        attributes: ['id', 'content'],     
                    }
                ]
            });
        if(allPosts.length == 0){
            return res.status(400).json('no post yet!');
        }
        return res.status(200).json({allPosts: allPosts});
    }
    catch(err){
        return res.status(500).json({message: "server connect error!"})
    }
}

const getPost = async (req,res)=>{
    try{
        const userId = req.params.id;
        const userPosts = await db.Posts.findAll({where: {userId}});
        if(userPosts.length === 0){
            return res.status(400).json({message: 'no post yet!'});
        }
        return res.status(200).json({userPosts: userPosts});
    }
    catch(error){
        return res.status(500).json({message: "server connect error!"})
    }

};

const createPost = async(req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'log in to continue!'});
        }
        const {title, content} = req.body;
        await db.Posts.create({
            userId,
            title,
            content
        });
        res.status(200).json({message: 'create new post successfully!'});
    }
    catch(error){
        return res.status(500).json({message: "server connect error!"})
    }
}

const updatePost = async (req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'log in to continue!'});
        }
        const idPost = req.params.id;
        const post = await db.Posts.findByPk(idPost);
        if(!post){
            return res.status(400).json({message: 'post not found!'});
        }
        const {title, content} = req.body;
        await post.update({
            title,
            content
        });
        return res.status(200).json({message: 'post has updated!'});
    }
    catch(error){
        return res.status(500).json({message: "server connect error!"})
    }
}

const updateThumbnail = async (req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'log in to continue!'});
        }
        if(!req.file){
            return res.status(400).json({message: 'invalid image!'});
        }
        const post = await db.Posts.findByPk(req.params.id);
        if(!post){
            return res.status(400).json({message: 'post not found!'});
        }
        await post.update({
            thumbnail: req.file.filename
        });
        return res.status(200).json({message: 'update successfully!'});
    }
    catch(err){
        return res.status(500).json({message: "server connect error!"})
    }
}

const deletePost = async(req,res)=>{
    try{
        const userId = req.session.userId;
        if(!userId){
            return res.status(400).json({message: 'log in to continue!'});
        }
        const idPost = req.params.id;
        const post = await db.Posts.findByPk(idPost);
        if(!post){
            return res.status(400).json({message: 'post not found!'});
        }
        await post.destroy();
        return res.status(200).json({message: 'delete successfully!'});
    }
    catch(error){
        return res.status(500).json({message: "server connect error!"})
    }
}

module.exports = {
    getAllPosts,
    getPost,
    updatePost,
    deletePost,
    createPost,
    updateThumbnail
}