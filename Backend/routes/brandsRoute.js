import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { createBrandCtrl, deleteBrandCtrl, getAllBrandsCtrl, getBrandCtrl, updateBrandCtrl } from "../controllers/brandCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";


const brandsRouter = express.Router();

brandsRouter.post("/", isLoggedIn,isAdmin, createBrandCtrl);
brandsRouter.get("/", getAllBrandsCtrl);
brandsRouter.get("/:id", getBrandCtrl);
brandsRouter.delete("/:id/delete", isLoggedIn,isAdmin, deleteBrandCtrl);
brandsRouter.put("/:id", isLoggedIn,isAdmin, updateBrandCtrl);
export default brandsRouter;
