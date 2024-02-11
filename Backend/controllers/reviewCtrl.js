import Review from "../model/Review.js";
import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";

//create review
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const {message, rating} = req.body;
//find product
const {productID} = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product not found");
  }
//check if user already reviewed this product
const hasReviewed = productFound?.reviews?.find((review)=>
review?.user.toString() === req?.userAuthId.toString()
)

if(hasReviewed){
    throw new Error("You already reviewed this product")
}

const review = await Review.create({
    message,
    rating,
    product:productFound?._id,
    user:req.userAuthId
})

//push review to product
productFound.reviews.push(review?._id)

//resave
await productFound.save()

res.status(201).json({
    success: true,
    message: "Review created successfully",
    review,
})
    })