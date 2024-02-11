import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

//create category
export const createCategoryCtrl = asyncHandler(async (req, res) => {

    const{name}=req.body;
    //Category exists
    const categoryFound = await Category.findOne({name});
    if(categoryFound){
        throw new Error("Category already exists");
    }
    //create category       
    const category = await Category.create({
        name:name?.toLowerCase(),
        user:req.userAuthId,
        image:req?.file?.path,
    });

     console.log(req.body);

    res.json({
        status:"success",
        message:"Category created successfully",
        category,
    })
})

//get all categories

export const getCategoriesCtrl = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
        status:"success",
        message:"Categories fetched successfully",
        categories,
    })
})

//get single category

export const getCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if(!category){
        throw new Error("Category not found");
    }
    res.json({
        status:"success",
        message:"Category fetched successfully",
        category,
    })
})

//update category

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
    const{name}=req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name.toLowerCase(),
      },
      { new: true }
    );
    res.json({
        status:"success",
        message:"Category updated successfully",
        category,
    })
})

//delete category

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    res.json({
        status:"success",
        message:"Category deleted successfully",
        category,
    })
}
)

