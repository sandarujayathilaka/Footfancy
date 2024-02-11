import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  coupon: null,
  coupons: [],
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create coupon action

export const createCouponAction = createAsyncThunk(
  "coupons/create",
  async (
    { code, discount, startDate, endDate },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/coupon`,
        {
          code,
          discount,
          startDate,
          endDate,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update coupon action

export const updateCouponAction = createAsyncThunk(
  "coupons/update",
  async (
    { code, discount, startDate, endDate, id },
    { rejectWithValue, getState, dispatch }
  ) => {
    console.log({ code, discount, startDate, endDate, id });
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/coupon/update/${id}`,
        {
          code,
          discount,
          startDate,
          endDate,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch coupons action

export const fetchCouponAction = createAsyncThunk(
  "coupons/fetchAll",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/coupon`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete coupons action

export const deleteCouponAction = createAsyncThunk(
  "coupons/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(
        `${baseURL}/coupon/${id}/delete`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch single coupon action

export const fetchSingleCouponAction = createAsyncThunk(
  "coupons/fetchSingle",
  async (code, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/coupon/single?code=${code}`,
        { code }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(createCouponAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.coupon = action.payload;
    });
    builder.addCase(createCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.coupon = null;
    });

    //fetch all coupons

    builder.addCase(fetchCouponAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons = action.payload;
    });
    builder.addCase(fetchCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.coupons = null;
    });

    //fetch single coupons

    builder.addCase(fetchSingleCouponAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchSingleCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.coupon = action.payload;
    });
    builder.addCase(fetchSingleCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.coupon = null;
    });

    //updatecoupons

    builder.addCase(updateCouponAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.coupon = action.payload;
    });
    builder.addCase(updateCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isUpdated = false;
      state.coupon = null;
    });

    //detelecoupons

    builder.addCase(deleteCouponAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
      state.coupon = action.payload;
    });
    builder.addCase(deleteCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
      state.coupon = null;
    });

    builder.addCase(resetErrAction.rejected, (state, action) => {
      state.error = null;
    });
    builder.addCase(resetSucAction.fulfilled, (state, action) => {
      state.isAdded = false;
    });
  },
});

const couponReducer = couponSlice.reducer;
export default couponReducer;
