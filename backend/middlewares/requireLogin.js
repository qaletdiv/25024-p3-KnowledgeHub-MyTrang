
const requireLogin = (req,res,next)=>{
    const userId = req.session.userId;
    if(!userId){
        return res.status(400).json({message: 'must login to continue!'});
    }
    next();
}

module.exports = requireLogin;