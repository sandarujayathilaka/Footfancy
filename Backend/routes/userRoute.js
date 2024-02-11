import express from 'express';
import { getUserProfileCtrl, loginUserCtrl, registerUserCtrl, updateShippingAddress } from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.put("/update/address", isLoggedIn, updateShippingAddress);
userRoutes.get("/profile",isLoggedIn, getUserProfileCtrl);

export default userRoutes;