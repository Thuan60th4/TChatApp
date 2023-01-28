import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import { Provider, useSelector } from "react-redux";

import MainNavigation from "./navigation/MainNavigation";
import AuthNavigation from "./navigation/AuthNavigation";
import { store } from "./store/store";

LogBox.ignoreLogs(["AsyncStorage has been extracted"]);

function Root() {
  const userInfo = useSelector((state) => state);
  if (userInfo.token) return <MainNavigation />;
  return <AuthNavigation />;
}

export default function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Root />
        </NavigationContainer>
      </Provider>
      <StatusBar style="light" />
    </>
  );
}
