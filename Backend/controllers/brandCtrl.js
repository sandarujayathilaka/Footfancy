import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";

//create category
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //Brand exists
  const brandFound = await Brand.findOne({ name });
  if (brandFound) {
    throw new Error("Brand already exists");
  }
  //create category
  const brand = await Brand.create({
    name:name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Brand created successfully",
    brand,
  });
});

//get all brands

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.json({
    status: "success",
    message: "Brands fetched successfully",
    brands,
  });
});

//get single brand

export const getBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  res.json({
    status: "success",
    message: "Brand fetched successfully",
    brand,
  });
});

//update brand

export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name: name.toLowerCase(),
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Brand updated successfully",
    brand,
  });
});

//delete brand

export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Brand deleted successfully",
    brand,
  });
});
