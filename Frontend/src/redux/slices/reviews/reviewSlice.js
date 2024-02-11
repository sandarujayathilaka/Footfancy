import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  review: {},
  reviews: [],
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create coupon action

export const createReviewAction = createAsyncThunk(
  "review/create",
  async ({ rating, message, id }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/review/${id}`,
        {
          rating,
          message,
          id,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch reviews action

export const fetchReviewsAction = createAsyncThunk(
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

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(createReviewAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createReviewAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.review = action.payload;
    });
    builder.addCase(createReviewAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.review = null;
    });

    builder.addCase(resetErrAction.rejected, (state, action) => {
      state.error = null;
    });
    builder.addCase(resetSucAction.fulfilled, (state, action) => {
      state.isAdded = false;
    });
  },
});

const reviewReducer = reviewsSlice.reducer;
export default reviewReducer;
