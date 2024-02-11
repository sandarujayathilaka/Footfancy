const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//add product to cart

export const addOrderToCartaction = createAsyncThunk(
  "cart/add-to-cart",
  async (cartItem) => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    //push to storage
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
);

//get cart item from local storage
export const getItemFromStorageAction = createAsyncThunk(
  "cart/get-to-cart",
  async () => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    return cartItems;
  }
);

//change order item quantity
export const changeOrderItemQtyAction = createAsyncThunk(
  "cart/change-qty",
  async ({ productId, qty }) => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    const newCartItems = cartItems?.map((item) => {
      if (item?._id === productId?.toString()) {
        const newPrice = item?.price * qty;
        item.qty = parseInt(qty);
        item.totalPrice = newPrice;
      }

      return item;
    });
    console.log(newCartItems);

    localStorage.setItem("cartItems", JSON.stringify(newCartItems));
  }
);

//change order item quantity
export const removeOrderItemAction = createAsyncThunk(
  "cart/remove-item",
  async (productId) => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    const newItems = cartItems?.filter((item) => item?._id !== productId);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(addOrderToCartaction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addOrderToCartaction.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      state.isAdded = true;
    });
    builder.addCase(addOrderToCartaction.rejected, (state, action) => {
      state.loading = false;
      state.cartItems = null;
      state.isAdded = false;
      state.error = action.payload;
    });

    //fetch cart items from local storage

    builder.addCase(getItemFromStorageAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getItemFromStorageAction.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      state.isAdded = true;
    });
    builder.addCase(getItemFromStorageAction.rejected, (state, action) => {
      state.loading = false;
      state.cartItems = null;
      state.isAdded = false;
      state.error = action.payload;
    });
  },
});

const cartReducer = cartSlice.reducer;
export default cartReducer;
