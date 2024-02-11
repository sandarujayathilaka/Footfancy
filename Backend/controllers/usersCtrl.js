import User from '../model/User.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import generateToken from "../utils/generateToken.js";
import { generateTokenFromHeader } from '../utils/generateTokenFromHeader.js';
import { verifyToken } from '../utils/verifyToken.js';

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  console.log(fullname,email,password)

  //check user exsits
  const userExsits = await User.findOne({ email });
  if (userExsits) {
    throw new Error("User already exsits");
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
try{
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    status: "success",
    message: "User registered",
    data: user,
  });
}catch(err){
  res.status(400).json({
    status: "fail",
    message: err.message,
  });
}
});

export const loginUserCtrl = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
console.log(email,password)
    //check user exsits
    const userFound = await User.findOne({email});

    if(userFound && await bcrypt.compare(password,userFound?.password)){
        res.status(200).json({
            status:"success",
            message:"User logged in",
            userFound,
            token:generateToken(userFound?._id),
        })
    }else{
        throw new Error("Provide Correct Credentials to Login");
    }
})

export const getUserProfileCtrl = asyncHandler(async (req,res)=>{
    
    const user = await User.findById(req.userAuthId).populate("orders");
    res.json({
        status:"success",
        message:"User profile fetched",
        user,
    })
    
}
)

export const updateShippingAddress = asyncHandler(async (req,res)=>{
const {firstName,lastName,address,city,postalCode,province,phone,country}=req.body;

const user = await User.findByIdAndUpdate(
  req.userAuthId,
  {
     shippingAddress: {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country,
    },
    hasShippingAddress: true,
  },
  /*  The new option, when set to true, specifies that the method should return the modified document 
  rather than the original one. Without this option, it would return the original document before the update.*/
  { new: true }
);

res.json({
  status: "success",
  message: "Shipping address updated",
  user,
});

});

