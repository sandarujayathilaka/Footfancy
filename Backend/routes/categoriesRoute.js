import express from 'express';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { createCategoryCtrl, deleteCategoryCtrl, getCategoriesCtrl, getCategoryCtrl, updateCategoryCtrl } from '../controllers/categoriesCtrl.js';
import categoryUpload from '../config/categoryUpload.js';
import isAdmin from '../middlewares/isAdmin.js';

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  isLoggedIn,
  isAdmin,categoryUpload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getCategoriesCtrl);
categoriesRouter.get("/:id", getCategoryCtrl);
categoriesRouter.delete("/:id/delete", isLoggedIn,isAdmin, deleteCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn,isAdmin, updateCategoryCtrl);
export default categoriesRouter;

