import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction } from "../globalAction/globalAction";

// createAsyncThunk use to handle async actions.if we need to make req for external server we use createAsyncThunk.
//createAction is used to handle sync actions.
//createSlice is used to handle both sync and async actions.

//initialState
const initialState = {
  loading: false,
  error: null,
  users: [],
  user: {},
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

//login action

export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue, getState, dispatch }) => {
    try {
      //make
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Register action

export const registerUserAction = createAsyncThunk(
  "users/register",
  async (
    { email, password, fullname },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      //make
      const { data } = await axios.post(`${baseURL}/users/register`, {
        email,
        password,
        fullname,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Update user shiping action

export const updateUserShippingAdressAction = createAsyncThunk(
  "users/shipping-address",
  async (
    {
      firstName,
      lastName,
      country,
      address,
      city,
      postalCode,
      province,
      phone,
    },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/users/update/address`,
        {
          firstName,
          lastName,
          address,
          city,
          country,
          postalCode,
          province,
          phone,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//get user profile

export const getUserProfileAction = createAsyncThunk(
  "users/profile",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//log out

export const logouteAction = createAsyncThunk(
  "users/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    localStorage.removeItem("userInfo");
    return true;
  }
);

//user slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    //handle actions

    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userAuth.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });

    //register
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //shipping
    builder.addCase(updateUserShippingAdressAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      updateUserShippingAdressAction.fulfilled,
      (state, action) => {
        state.user = action.payload;
        state.loading = false;
      }
    );
    builder.addCase(
      updateUserShippingAdressAction.rejected,
      (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }
    );

    //logout
    builder.addCase(logouteAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = null;
    });

    //profile
    builder.addCase(getUserProfileAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.loading = false;
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    //reset action error
    builder.addCase(resetErrAction.pending, (state) => {
      state.userAuth.error = null;
    });
  },
});

//generate reducer

const userReduser = usersSlice.reducer;

export default userReduser;
