import User from "../model/User.js"

const isAdmin = async (req, res, next) => {
    //find the login user
    const user = await User.findById(req.userAuthId);
    //check if user is admin
    if(user.isAdmin){
        next();
    }else{
        next(new Error("You are not authorized to perform this Admin action"));
    }
}
export default isAdmin;