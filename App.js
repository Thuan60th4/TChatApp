import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

import MainNavigation from "./navigation/MainNavigation";
import AuthNavigation from "./navigation/AuthNavigation";
import { store } from "./store/store";
import { useEffect } from "react";
import { getUserData } from "./firebase/auth";
import { authenticate } from "./store/AuthSlice";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

LogBox.ignoreLogs(["Sending `onAnimatedValueUpdate`"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted"]); //hủy cái warning của react khi dùg firebase
SplashScreen.preventAutoHideAsync();

function Root() {
  const userInfo = useSelector((state) => state);
  const dispatch = useDispatch();
  useEffect(() => {
    const getToken = async () => {
      try {
        const result = await AsyncStorage.getItem("token");
        if (result) {
          const token = JSON.parse(result);
          if (new Date(token.expiryDateToken) >= new Date()) {
            const userData = await getUserData(token.userId);
            dispatch(authenticate({ token, userData }));
          }
        }
      } catch (error) {
        console.log(error);
      }
      await SplashScreen.hideAsync();
    };
    getToken();
  }, []);

  if (!!userInfo.token) return <MainNavigation />;
  return <AuthNavigation />;
}

export default function App() {
  return (
    <>
      <ActionSheetProvider>
        <Provider store={store}>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </Provider>
      </ActionSheetProvider>
      <StatusBar style="light" />
    </>
  );
}
