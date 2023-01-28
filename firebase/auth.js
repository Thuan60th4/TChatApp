import { app } from "./index";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

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
  await set(ref(db, "users/" + userId), userData);
  return userData;
};

export const signUp = async (firstName, lastName, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = user.stsTokenManager.accessToken;
    const userData = await saveUserDatabase(
      firstName,
      lastName,
      email,
      user.uid
    );
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
    return;
  } catch (error) {
    console.log(error.code);
    return { error: error.code };
  }
};
