import { createSlice } from "@reduxjs/toolkit";

const ActionSlice = createSlice({
  name: "Auth",
  initialState: {
    token: "",
    userData: {},
    friendChatData: {},
    chatsData: [],
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    updateDataState: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    storeFriendChat: (state, action) => {
      state.friendChatData = action.payload;
    },
    setChatsData: (state, action) => {
      state.chatsData = action.payload;
    },
  },
});

export const { authenticate, updateDataState, storeFriendChat, setChatsData } =
  ActionSlice.actions;

export default ActionSlice.reducer;
