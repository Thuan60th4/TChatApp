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
  },
});

export const { authenticate } = AuthSlice.actions;

export default AuthSlice.reducer;
