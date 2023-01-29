import { app } from "./index";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { get, getDatabase, ref, set, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = getAuth();
const db = getDatabase();

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
  const fullName = `${newData.firstName} ${newData.lastName}`.toLowerCase();
  newData.fullName = fullName;
  try {
    await update(ref(db, "users/" + userId), newData);
    return true;
  } catch (error) {
    console.log(error);
  }
};

const saveDataStorage = (token, expiryDateToken, userId) => {
  AsyncStorage.setItem(
    "token",
    JSON.stringify({ token, expiryDateToken, userId })
  );
};

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

export const logOut = async () => {
  try {
    await signOut(auth);
    AsyncStorage.removeItem("token");
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
