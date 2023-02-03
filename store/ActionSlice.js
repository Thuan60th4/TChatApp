import { createSlice } from "@reduxjs/toolkit";

const ActionSlice = createSlice({
  name: "Auth",
  initialState: {
    token: "",
    userData: {},
    friendChatData: {},
    chatsData: {},
    storedUsers: {},
    messagesData: {},
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
      // nó bị lỗi gì mà chỉ đọc chứ ko ghi được ấy nên phải dùng cách này để copy lại object r ghi vào
      state.chatsData = { ...action.payload };
    },

    setStoredUsers: (state, action) => {
      const newUsers = action.payload;
      state.storedUsers[newUsers.userId] = newUsers;
    },
    setChatMessages: (state, action) => {
      const { chatId, messagesData } = action.payload;
      state.messagesData[chatId] = messagesData;
    },
  },
});

export const {
  authenticate,
  updateDataState,
  setStoreFriendChat,
  setChatsData,
  setStoredUsers,
  setChatMessages,
} = ActionSlice.actions;

export default ActionSlice.reducer;
