import "react-native-get-random-values";
import { app } from "./initalFirebase";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  endAt,
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  startAt,
  update,
} from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref as refStorage,
  uploadBytes,
} from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import * as Device from "expo-device";

const auth = getAuth();
const db = getDatabase();

export const signUp = async (firstName, lastName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { accessToken, expirationTime } = user.stsTokenManager;
    const token = accessToken;
    const expiryDateToken = new Date(expirationTime).toISOString();

    const userData = await saveUserDatabase(
      firstName,
      lastName,
      email,
      user.uid
    );

    saveDataStorage(token, expiryDateToken, user.uid);

    return { token, userData };
  } catch (error) {
    console.log(error.message);
    return { error: error.code };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const { accessToken, expirationTime } = user.stsTokenManager;
    const token = accessToken;
    const expiryDateToken = new Date(expirationTime).toISOString();

    const userData = await getUserData(user.uid);
    saveDataStorage(token, expiryDateToken, user.uid);

    return { token, userData };
  } catch (error) {
    console.log(error.code);
    return { error: error.code };
  }
};

export const logOut = async (userId, newListPushTok) => {
  try {
    if (Device.isDevice && newListPushTok) {
      await update(ref(db, `users/${userId}`), {
        pushTokens: newListPushTok,
      });
    }
    await signOut(auth);
    AsyncStorage.removeItem("token");
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const saveDataStorage = (token, expiryDateToken, userId) => {
  AsyncStorage.setItem(
    "token",
    JSON.stringify({ token, expiryDateToken, userId })
  );
};

export const saveUserDatabase = async (firstName, lastName, email, userId) => {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    fullName,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };
  try {
    await set(ref(db, "users/" + userId), userData);
    return userData;
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (userId) => {
  try {
    const userData = await get(ref(db, "users/" + userId));
    return userData.val();
  } catch (error) {
    console.log(error);
  }
};

export const updateUserData = async (userId, newData) => {
  if (newData.firstName || newData.lastName) {
    const fullName = `${newData.firstName} ${newData.lastName}`.toLowerCase();
    newData.fullName = fullName;
  }
  try {
    await update(ref(db, "users/" + userId), newData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const uploadImageToFirebase = async (uri, folder) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = refStorage(getStorage(), `${folder}/${uuidv4()}`);
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(fileRef);
};

export const searchUsers = async (queryText) => {
  const searchTerm = queryText.toLowerCase();

  try {
    const userRef = ref(db, "users");

    const queryRef = query(
      userRef,
      orderByChild("fullName"),
      startAt(searchTerm),
      endAt(searchTerm + "\uf8ff")
    );

    const snapshot = await get(queryRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error) {
    console.log(error);
  }
};

export const createChat = async (
  loggedInUserId,
  idUsersInChat,
  content,
  imgUrl = "",
  title,
  isGroup = false
) => {
  const chatData = {
    users: idUsersInChat,
    title: title,
    isGroup: isGroup,
    lastMessageText: imgUrl ? "Sent a picture" : content,
    createtedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createtedBy: loggedInUserId,
    updatedBy: loggedInUserId,
  };
  try {
    const chatKey = await push(ref(db, "chats"), chatData);
    for (const userId of idUsersInChat) {
      await push(ref(db, "userChats/" + userId), chatKey.key);
    }
    await push(ref(db, "messages/" + chatKey.key), {
      sentBy: loggedInUserId,
      sentAt: new Date().toISOString(),
      text: content,
      imageUrl: imgUrl,
    });

    return chatKey.key;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateChat = async (chatId, chatData) => {
  try {
    await update(ref(db, "chats/" + chatId), {
      ...chatData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeOnechat = async (chatId, userRemovedId) => {
  try {
    const userChatsRef = await get(ref(db, `userChats/${userRemovedId}`));
    const listChat = userChatsRef.val();
    for (const key in listChat) {
      if (listChat[key] == chatId) {
        await remove(ref(db, `userChats/${userRemovedId}/${key}`));
        break;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const removeUserFromChat = async (
  chatId,
  userLoggedInData,
  newListUser,
  messageText
) => {
  try {
    const chatRef = ref(db, "chats/" + chatId);
    if (newListUser.length == 0) {
      await remove(chatRef);
      await remove(ref(db, "messages/" + chatId));

      return;
    }
    await update(chatRef, {
      newUsers: newListUser,
      updatedAt: new Date().toISOString(),
      updatedBy: userLoggedInData,
    });
    await sendMessage(
      chatId,
      userLoggedInData,
      messageText,
      null,
      null,
      "info"
    );
  } catch (error) {
    console.log(error);
  }
};

export const addUserToChat = async (
  chatId,
  userLoggedInData,
  newListUser,
  newUser,
  listWantAdd,
  messageText
) => {
  try {
    const chatRef = ref(db, "chats/" + chatId);
    await update(chatRef, {
      newUsers: newListUser,
      users: newUser,
      updatedAt: new Date().toISOString(),
      updatedBy: userLoggedInData,
    });

    await sendMessage(
      chatId,
      userLoggedInData,
      messageText,
      null,
      null,
      "info"
    );

    for (const userId of listWantAdd) {
      await push(ref(db, "userChats/" + userId), chatId);
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = async (
  chatId,
  senderId,
  content,
  messageReplyId,
  imageUrl,
  type
) => {
  const timeSend = new Date().toISOString();
  const messageData = {
    sentBy: senderId,
    sentAt: timeSend,
    text: content,
  };
  if (messageReplyId) messageData.messageReplyId = messageReplyId;

  if (imageUrl) messageData.imageUrl = imageUrl;

  if (type) messageData.type = type;

  try {
    await push(ref(db, "messages/" + chatId), messageData);
    await update(ref(db, "chats/" + chatId), {
      updatedAt: timeSend,
      updatedBy: senderId,
      lastMessageText: imageUrl ? "Sent a picture" : content,
    });
  } catch (error) {
    console.log(error);
  }
};

export const addHeartMessage = async (heartDataArray, chatId, messageId) => {
  try {
    await update(ref(db, `messages/${chatId}/${messageId}`), {
      heart: heartDataArray,
    });
  } catch (error) {
    console.log(error);
  }
};

export const storePushToken = async (userData, token) => {
  if (!Device.isDevice) {
    return;
  }

  const tokenData = userData.pushTokens || [];

  if (tokenData.includes(token)) {
    return;
  }

  await update(ref(db, `users/${userData.userId}`), {
    pushTokens: [...tokenData, token],
  });
};

export const sendNotifications = async (chatId, chatUsers, title, body) => {
  try {
    chatUsers.forEach(async (uid) => {
      const result = await get(ref(db, `users/${uid}`));
      if (!result.exists()) return;
      const data = result.val();
      if (!data?.pushTokens) return;
      for (const token of data.pushTokens) {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: token,
            title,
            body,
            data: { chatId },
          }),
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const unsentMessage = async (chatId, messageId, name) => {
  try {
    await update(ref(db, `messages/${chatId}/${messageId}`), {
      heart: [],
      text: "Unsent a message",
      imageUrl: "",
      unsend :true
    });

    await update(ref(db, "chats/" + chatId), {
      updatedAt: new Date().toISOString(),
      lastMessageText: `${name} unsent a message`,
    });
  } catch (error) {
    console.log(error);
  }
};
