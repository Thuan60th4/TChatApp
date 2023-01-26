import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import MainNavigation from "./navigation/MainNavigation";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
