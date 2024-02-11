import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createOrder, getAllOrders, getSalesStats, getSingleOrder, updateOrderStatus } from "../controllers/orderCtrl.js";

const orderRouter = express.Router();

orderRouter.post("/", isLoggedIn, createOrder);
orderRouter.get("/",isLoggedIn, getAllOrders);
orderRouter.get("/:id",isLoggedIn, getSingleOrder);
orderRouter.get("/sales/sum", isLoggedIn, getSalesStats);
orderRouter.put("/update/:id", isLoggedIn,updateOrderStatus);
export default orderRouter;
