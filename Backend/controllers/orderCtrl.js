import Order from "../model/Order.js";
import asyncHandler from "express-async-handler";
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import Coupon from "../model/Coupon.js";
dotenv.config();

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);


export const createOrder = asyncHandler(async (req, res) => {
  //get the order items, shipping address, total price
  const { orderItems, shippingAddress, totalPrice } = req.body;

  // //get the coupon
  // const { coupon } = req?.query;

  // const couponFound = await Coupon.findOne({
  //   code: coupon?.toUpperCase(),
  // });

  // if (coupon) {
  //   const couponFound = await Coupon.findOne({ code: coupon?.toUpperCase() });
  // }

  // if (couponFound?.isExpired) {
  //   throw new Error("Coupon expired");
  // }
  // if (!couponFound) {
  //   throw new Error("Invalid coupon");
  // }

  //get discount

  // const discount = couponFound?.discount / 100;

  //find the user
  const user = await User.findById(req.userAuthId);

  //check has shiping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please add shipping address");
  }

  //check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No order items");
  }
  //place order - save in DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice * (1 - discount) : totalPrice,
    totalPrice,
  });
  //push Order to user
  user.orders.push(order._id);
  await user.save();

  //update the product qty
  const products = await Product.find({
    _id: {
      $in: orderItems,
    },
  });

  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id.toString();
    });

    if (product) {
      product.totalSold += order.qty;
    }
    console.log(product.totalSold);
    await product.save();
  });
  //make payment stripe

  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
})

//get all orders

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders fetched successfully", 
    orders,
  })
})

//get single order

export const getSingleOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if(order){
    res.json({
      success: true,  
      order,
    })
  }else{
    throw new Error("Order not found")
  }
})

//update order status

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const updateOrder = await Order.findByIdAndUpdate(id, {
    status: req.body.status,
  }, {
    new: true,
  });

  res.status(200).json({
    success: true,
    updateOrder,
  })
})

//get sales sum of orders

export const getSalesStats = asyncHandler(async (req, res) => {
  //get the sum of sales
  //get the minimum and max order
  const Orderstats = await Order.aggregate([
    {
      $group:{
        _id:null,
        minimumSales:{
          $min:"$totalPrice",
        },
          totalSales:{
          $sum:"$totalPrice"
        },
        maximumSales:{
          $max:"$totalPrice",
        },
        averageSales:{
          $avg:"$totalPrice",
        },
      }
    }
  ])
  //get the date
  const date = new Date()
  const today = new Date(date.getFullYear(),date.getMonth(),date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match:{
        createdAt:{
          $gte:today,
        }
      }
    },
    {
      $group:{
        _id:null,
        totalSalesToday:{
          $sum:"$totalPrice",
        },
      }
    }
  ])
  res.status(200).json({
    success: true,
    Orderstats,
    saleToday
  });
})