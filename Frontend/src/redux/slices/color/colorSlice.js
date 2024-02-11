import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSucAction } from "../globalAction/globalAction";

const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");

//initialState
const initialState = {
  loading: false,
  error: null,
  colors: [],
  color: {},
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

//create color action

export const createColorAction = createAsyncThunk(
  "color/create",
  async (name, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState().users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${baseURL}/colors`,
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

//fetch color action

export const fetchColorAction = createAsyncThunk(
  "color/fetchAll",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.get(`${baseURL}/colors`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const colorSlice = createSlice({
  name: "colors",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(createColorAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createColorAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.color = action.payload;
    });
    builder.addCase(createColorAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.color = null;
    });

    //fetch color

    builder.addCase(fetchColorAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchColorAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isAdded = true;
      state.colors = action.payload;
    });
    builder.addCase(fetchColorAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAdded = false;
      state.colors = null;
    });

    builder.addCase(resetErrAction.rejected, (state, action) => {
      state.error = null;
      state.isAdded = false;
    });
    builder.addCase(resetSucAction.fulfilled, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
  },
});

const colorReducer = colorSlice.reducer;
export default colorReducer;
