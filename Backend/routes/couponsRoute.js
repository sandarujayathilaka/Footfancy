import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createCoupon, deleteCoupon, getAllCoupons, getSingleCoupon, updateCoupon } from "../controllers/couponCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";



const couponsRouter = express.Router();

couponsRouter.post("/", isLoggedIn,isAdmin, createCoupon);
couponsRouter.get("/", getAllCoupons);
couponsRouter.get("/single",getSingleCoupon);
couponsRouter.delete("/:id/delete", isLoggedIn,isAdmin, deleteCoupon);
couponsRouter.put("/update/:id", isLoggedIn,isAdmin, updateCoupon);

export default couponsRouter;
