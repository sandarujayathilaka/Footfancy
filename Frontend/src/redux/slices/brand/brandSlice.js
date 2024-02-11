import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";
const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  brands: [],
  brand: {},
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create brand action

export const createBrandAction = createAsyncThunk(
  "brand/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/brands`,
        {
          name,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch brand action

export const fetchBrandAction = createAsyncThunk(
  "brand/fetchAll",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/brands`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const brandSlice = createSlice({
  name: "brands",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(createBrandAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createBrandAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.brand = action.payload;
    });
    builder.addCase(createBrandAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.brand = null;
    });

    //fetch brand

    builder.addCase(fetchBrandAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchBrandAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.brands = action.payload;
    });
    builder.addCase(fetchBrandAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.brands = null;
    });

    builder.addCase(resetErrAction.rejected, (state, action) => {
      state.error = null;
    });
    builder.addCase(resetSucAction.fulfilled, (state, action) => {
      state.isAdded = false;
    });
  },
});

const brandReducer = brandSlice.reducer;
export default brandReducer;
