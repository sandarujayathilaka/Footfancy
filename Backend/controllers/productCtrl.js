
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

export const createProductCtrl = asyncHandler(async (req, res) => {
 
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    price,
    totalQty,
  } = req.body;

  const convertedImgs = req.files.map((file) => file?.path);

  console.log(convertedImgs)

  //Product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product already exists");
  }
  //find the category
  const categoryFound = await Category.findOne({
    name: category.toLowerCase(),
  });
  if (!categoryFound) {
    throw new Error("Category not found");
  }
  //find the brand
  const brandFound = await Brand.findOne({ name: brand.toLowerCase() });
  if (!brandFound) {
    throw new Error("Brand not found");
  }
  //create product
  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    images: convertedImgs,
  });

  //push the product into the category
  categoryFound.products.push(product._id);

  //resave
  await categoryFound.save();

  //push the product into the brand
  brandFound.products.push(product._id);

  //resave
  await brandFound.save();

  //send response
  res.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
})

//get all products
export const getProductsCtrl = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find();

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //search by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //search by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //search by colors
  if (req.query.colors) {

    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: "i" },
    });
  }

  //search by sizes
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }

  //filter by price range
  //gte = greater than or equal to lte = less than or equal to
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination
  //page

  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 20;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total documents
  const total = await Product.countDocuments();
  
  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination result
  const pagination = {};
  if(endIndex < total){
      pagination.next = {
          page:page+1,
          limit,
      }
  }

  if(startIndex > 0){
      pagination.prev = {
          page:page-1,
          limit,
      }
  }

  //awaiting for the query
  const products = await productQuery.populate('reviews');



  res.json({
    status: "success",
    total,
    pagination,
    results: products.length,
    message: "Products fetched successfully",
    products,
  });
})

//get single product

export const getProductCtrl = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate({
      path:"reviews",
      populate:{
        path:"user",
        select:"fullname"
      }
    });
    if (!product) {
        throw new Error("Product not found");
    }
    
    res.json({
        status: "success",
        message: "Product fetched successfully",
        product,
    });
    })

    //update product

    export const updateProductCtrl = asyncHandler(async (req, res) => {

        const{name,description,brand,category,sizes,colors,user,price,totalQty}=req.body;

        const product = await Product.findByIdAndUpdate(req.params.id,{
        name,
        description,
        brand,
        category,
        sizes,
        colors,
        user,
        price,
        totalQty,
        },
        {
            new: true,
            runValidators: true,
        }
    )
     res.json({
       status: "success",
       message: "Product Updated successfully",
       product
     });


    })

    export const deleteProductCtrl = asyncHandler(async (req, res) => {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json({
            status: "success",
            message: "Product deleted successfully",
        });
        }
    )