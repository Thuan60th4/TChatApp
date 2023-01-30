import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: {
    token: "",
    userData: {},
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    updateDataState: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
  },
});

export const { authenticate, updateDataState } = AuthSlice.actions;

export default AuthSlice.reducer;
