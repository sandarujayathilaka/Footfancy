import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createColorCtrl, deleteColorCtrl, getAllcolorsCtrl, getcolorCtrl, updateColorCtrl } from "../controllers/colorCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";



const colorRouter = express.Router();

colorRouter .post("/", isLoggedIn,isAdmin, createColorCtrl);
colorRouter .get("/", getAllcolorsCtrl);
colorRouter .get("/:id", getcolorCtrl);
colorRouter .delete("/:id/delete", isLoggedIn,isAdmin, deleteColorCtrl);
colorRouter .put("/:id", isLoggedIn,isAdmin, updateColorCtrl);
export default colorRouter ;
