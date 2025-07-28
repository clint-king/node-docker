const protect = (req, res , next) =>{
    const {user} = req.session;

    if(!user){
        return res.status(401).json({status: 'fail', message: 'unathorized'});
    }

    req.user = user;

    next();// send it to the controller or next middleware in the stack
}

export default protect;