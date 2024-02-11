import Color from "../model/Color.js";
import asyncHandler from "express-async-handler";

//create color
export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //color exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error("Color already exists");
  }
  //create color
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });

  res.json({
    status: "success",
    message: "Color created successfully",
    color,
  });
});

//get all colors

export const getAllcolorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();
  res.json({
    status: "success",
    message: "Colors fetched successfully",
    colors,
  });
});

//get single Color

export const getcolorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) {
    throw new Error("color not found");
  }
  res.json({
    status: "success",
    message: "color fetched successfully",
    color,
  });
});

//update color

export const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "color updated successfully",
    color,
  });
});

//delete color

export const deleteColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "color deleted successfully",
    color,
  });
});
