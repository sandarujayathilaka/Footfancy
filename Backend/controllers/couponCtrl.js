import e from "express";
import Coupon from "../model/Coupon.js";
import asyncHandler from "express-async-handler";

//create coupon

export const createCoupon = asyncHandler(async (req, res) => {
     const { code, discount, startDate, endDate } = req.body;
    //check admin
    //check if coupon exsits
    const couponsExsits = await Coupon.findOne({ code });
    if (couponsExsits) {
        throw new Error("Coupon already exsits");
    }

    //check if discount is valid
    if(isNaN(discount)){
        throw new Error("Discount must be a number");
    }

    //create coupon
    const coupon = await Coupon.create({
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
        user: req.userAuthId,
    });
    
    res.status(201).json({
        status: "success",
        message: "Coupon created",
        coupon,
    });
    });

 //get all coupons
 
 export const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json({
        status: "success",
        message: "Coupons fetched",
        coupons,
    })
})

//get single coupon

export const getSingleCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code });
  //check not found
  if (coupon === null) {
    throw new Error("Coupon not found");
  }

  //check if expired
    if (coupon.isExpired) {
        throw new Error("Coupon expired");
    }

  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
})

//update coupon

export const updateCoupon = asyncHandler(async (req, res) => {
    const { code, discount, startDate, endDate } = req.body;
    console.log(req.params.id)
    //check if coupon exsits
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, {
        code: code?.toUpperCase(),
        discount,
        startDate,
        endDate,
    },
        { new: true });

        res.json({
          status: "success",
          message: "Coupon updated",
          coupon,
        });

}
)


//delete coupon
export const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    res.json({
        status: "success",
        message: "Coupon deleted",
        coupon,
    })
})
