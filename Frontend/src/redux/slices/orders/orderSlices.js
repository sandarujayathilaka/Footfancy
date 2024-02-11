import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  orders: [],
  order: null,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
  stats: null,
};

//place a order action

export const placeOrderAction = createAsyncThunk(
  "order/place",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { orderItems, shippingAddress, totalPrice } = payload;

      console.log(shippingAddress);
      console.log(orderItems);

      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${baseURL}/order`,
        { orderItems, shippingAddress, totalPrice },
        config
      );
      return window.open(data?.url);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update order

export const updateOrderAction = createAsyncThunk(
  "order/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { status, id } = payload;

      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${baseURL}/order/update/${id}`,
        { status },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get statistics

export const getOrderStatisticAction = createAsyncThunk(
  "order/statistic",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/order/sales/sum`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch order action

export const fetchOrderAction = createAsyncThunk(
  "order/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/order`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch one order action

export const fetchOneOrderAction = createAsyncThunk(
  "order/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/order/${productId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    //create
    builder.addCase(placeOrderAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(placeOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.order = action.payload;
    });

    builder.addCase(placeOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.order = null;
    });

    //fetch all
    builder.addCase(fetchOrderAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });

    builder.addCase(fetchOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.orders = null;
    });

    //fetch product
    builder.addCase(fetchOneOrderAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOneOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });

    builder.addCase(fetchOneOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.order = null;
    });

    //fetch stats
    builder.addCase(getOrderStatisticAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getOrderStatisticAction.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    });

    builder.addCase(getOrderStatisticAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.stats = null;
    });

    //update Order
    builder.addCase(updateOrderAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });

    builder.addCase(updateOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.order = null;
    });

    //reset error
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });
    //reset success
    builder.addCase(resetSucAction.pending, (state, action) => {
      state.isAdded = false;
    });
  },
});

const OrderReducer = orderSlice.reducer;
export default OrderReducer;
