import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { MenuProvider } from "react-native-popup-menu";

import AuthNavigation from "./navigation/AuthNavigation";
import { store } from "./store/store";
import { useEffect } from "react";
import { getUserData } from "./firebase";
import { authenticate } from "./store/ActionSlice";
import HomeNavigation from "./navigation/HomeNavigation";

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
          // if (new Date(token.expiryDateToken) >= new Date()) {
          const userData = await getUserData(token.userId);
          dispatch(authenticate({ token, userData }));
          // }
        }
      } catch (error) {
        console.log(error);
      }
      await SplashScreen.hideAsync();
    };
    getToken();
  }, []);

  if (!!userInfo.token) return <HomeNavigation />;
  return <AuthNavigation />;
}

export default function App() {
  return (
    <>
      <Provider store={store}>
        <MenuProvider>
          <ActionSheetProvider>
            <NavigationContainer>
              <Root />
            </NavigationContainer>
          </ActionSheetProvider>
        </MenuProvider>
      </Provider>
      <StatusBar style="light" />
    </>
  );
}
