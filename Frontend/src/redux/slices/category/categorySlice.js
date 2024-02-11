import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  categories: [],
  category: {},
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create category action

export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { name, file } = payload;
      //fromData
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("file", file);
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      };
      const { data } = await axios.post(
        `${baseURL}/categories`,
        formdata,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch category action

export const fetchCategoryAction = createAsyncThunk(
  "category/fetchAll",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/categories`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(createCategoryAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.category = action.payload;
    });
    builder.addCase(createCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.category = null;
    });

    //fetch category

    builder.addCase(fetchCategoryAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    });
    builder.addCase(fetchCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.categories = null;
    });

    //reset

    builder.addCase(resetErrAction.rejected, (state, action) => {
      state.error = null;
    });

    builder.addCase(resetSucAction.fulfilled, (state, action) => {
      state.isAdded = false;
    });
  },
});

const categoryReducer = categorySlice.reducer;
export default categoryReducer;
