import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import MainNavigation from "./navigation/MainNavigation";
import AuthNavigation from "./navigation/AuthNavigation";

export default function App() {
  let isLogin = false;
  let screen;
  if (isLogin) {
    screen = <MainNavigation />;
  } else {
    screen = <AuthNavigation />;
  }
  return (
    <>
      <NavigationContainer>{screen}</NavigationContainer>
      <StatusBar style="light" />
    </>
  );
}
