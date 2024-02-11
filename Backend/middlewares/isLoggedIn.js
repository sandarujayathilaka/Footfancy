import { generateTokenFromHeader } from "../utils/generateTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
    //get token from header
    const token = generateTokenFromHeader(req);
    //veryfy token
    const decodedUser = verifyToken(token);
    if(!decodedUser){
        throw new Error("Invalid/Expired token");
    }else{
        //save the user into req object
        req.userAuthId = decodedUser?.id
        next();
    }
}