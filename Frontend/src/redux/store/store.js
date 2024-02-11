import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/users/usersSlice";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/category/categorySlice";
import brandReducer from "../slices/brand/brandSlice";
import colorReducer from "../slices/color/colorSlice";
import cartReducer from "../slices/cart/cartSlices";
import couponReducer from "../slices/coupons/couponSlice";
import OrderReducer from "../slices/orders/orderSlices";
import reviewReducer from "../slices/reviews/reviewSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    products: productReducer,
    categories: categoryReducer,
    brands: brandReducer,
    colors: colorReducer,
    carts: cartReducer,
    coupons: couponReducer,
    orders: OrderReducer,
    reviews: reviewReducer,
  },
});

export default store;
