import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  products: [],
  product: {},
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create product action

export const createProductAction = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);
    try {
      const {
        name,
        price,
        description,
        category,
        sizes,
        brand,
        colors,
        totalQty,
        files,
      } = payload;
      console.log(files);
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);

      formData.append("brand", brand);

      formData.append("totalQty", totalQty);
      formData.append("files", files);

      sizes.forEach((size) => {
        formData.append("sizes", size);
      });
      colors.forEach((color) => {
        formData.append("colors", color);
      });
      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(
        `${baseURL}/products`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update product action

export const updateProductAction = createAsyncThunk(
  "product/update",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {
        name,
        price,
        description,
        category,
        sizes,
        brand,
        colors,
        totalQty,
        id,
      } = payload;

      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // "content-type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(
        `${baseURL}/products/${id}`,
        { name, price, description, category, sizes, brand, colors, totalQty },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch products action

export const fetchProductAction = createAsyncThunk(
  "product/list",
  async ({ url }, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${url}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//delete product action

export const deleteProductAction = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${baseURL}/products/${id}/delete`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch one product action

export const fetchOneProductAction = createAsyncThunk(
  "product/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${baseURL}/products/${productId}`,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  extraReducers: (builder) => {
    //create
    builder.addCase(createProductAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.product = action.payload;
    });

    builder.addCase(createProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.product = null;
    });

    //fetch all
    builder.addCase(fetchProductAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.products = action.payload;
    });

    builder.addCase(fetchProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.products = null;
    });

    //fetch product
    builder.addCase(fetchOneProductAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchOneProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.product = action.payload;
    });

    builder.addCase(fetchOneProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.product = null;
    });

    //update
    builder.addCase(updateProductAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.product = action.payload;
    });

    builder.addCase(updateProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isUpdated = false;
      state.product = null;
    });

    //delete
    builder.addCase(deleteProductAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteProductAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
      state.product = action.payload;
    });

    builder.addCase(deleteProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isDeleted = false;
      state.product = null;
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

const productReducer = productSlice.reducer;
export default productReducer;
