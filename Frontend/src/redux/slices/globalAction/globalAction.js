import { createAsyncThunk } from "@reduxjs/toolkit";

//reset error action

export const resetErrAction = createAsyncThunk("resetErr", () => {
  return null;
});

//reset success action

export const resetSucAction = createAsyncThunk("resetSuc", () => {
  return null;
});
