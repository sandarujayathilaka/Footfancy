import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createProductCtrl, deleteProductCtrl, getProductCtrl, getProductsCtrl, updateProductCtrl } from '../controllers/productCtrl.js';
import upload from '../config/fileUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const productsRoter = express.Router();

productsRoter.post("/",isLoggedIn,isAdmin,upload.array("files"), createProductCtrl);
productsRoter.get("/", getProductsCtrl);
productsRoter.get("/:id", getProductCtrl);
productsRoter.put("/:id",isLoggedIn,isAdmin,updateProductCtrl);
productsRoter.delete("/:id/delete", isLoggedIn,isAdmin,deleteProductCtrl);
export default productsRoter;
