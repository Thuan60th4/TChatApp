import { createSlice } from "@reduxjs/toolkit";

const ActionSlice = createSlice({
  name: "Auth",
  initialState: {
    token: "",
    userData: {},
    friendChatData: {},
    chatsData: {},
    storedUsers: {},
  },
  reducers: {
    authenticate: (state, action) => {
      state.token = action.payload.token;
      state.userData = action.payload.userData;
    },
    updateDataState: (state, action) => {
      state.userData = { ...state.userData, ...action.payload };
    },
    setStoreFriendChat: (state, action) => {
      state.friendChatData = action.payload;
    },
    setChatsData: (state, action) => {
      state.chatsData = action.payload;
    },

    setStoredUsers: (state, action) => {
      const newUsers = action.payload;
      state.storedUsers[newUsers.userId] = newUsers;
    },
  },
});

export const {
  authenticate,
  updateDataState,
  setStoreFriendChat,
  setChatsData,
  setStoredUsers,
} = ActionSlice.actions;

export default ActionSlice.reducer;
