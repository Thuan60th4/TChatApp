import { Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import ChatListScreen from "../screens/ChatListScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import SettingScreen from "../screens/SettingScreen";
import { Colors } from "../constants/colors";
import NewChatScreen from "../screens/NewChatScreen";

const Stack = createStackNavigator();
const Bottom = createBottomTabNavigator();

function BottomTab() {
  return (
    <Bottom.Navigator
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 23, color: "white" },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: "black",
          borderTopWidth: 0,
        },
        tabBarInactiveTintColor: "white",
        tabBarActiveTintColor: Colors.blue,
        tabBarLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Bottom.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={({ navigation }) => ({
          title: "Chats",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          headerLeft: () => (
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.wrapIcon}>
              <TouchableOpacity>
                <Feather
                  style={styles.headerIcon}
                  name="camera"
                  size={22}
                  color={Colors.blue}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("newChat")}>
                <FontAwesome
                  style={[styles.headerIcon, { marginTop: 2 }]}
                  name="pencil-square-o"
                  size={22}
                  color={Colors.blue}
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Bottom.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ size, color }) => (
            <SimpleLineIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Bottom.Navigator>
  );
}

const config = {
  animation: "timing",
  config: {
    duration: 250,
    // easing: Easing.linear,
  },
};

const closeConfig = {
  animation: "timing",
  config: {
    duration: 150,
    easing: Easing.linear,
  },
};
function MainNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true, // giúp android cũng có thể gàn ngang để trở về như ios
        headerTitleAlign: "center",
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="home"
        component={BottomTab}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chatDetail"
        component={ChatDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: Colors.space,
          },
        }}
      />

      <Stack.Screen
        name="newChat"
        component={NewChatScreen}
        options={({ navigation }) => ({
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
          // presentation: "modal",
          title: "New Chat",
          headerBackTitleVisible: false,
          headerShadowVisible: false,

          headerLeft: "",
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                style={[styles.headerIcon, { marginRight: 10 }]}
                name="closecircle"
                size={24}
                color={Colors.grey}
              />
            </TouchableOpacity>
          ),
          headerStyle: { backgroundColor: Colors.space, borderBottomWidth: 0 },
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  editText: {
    fontSize: 19,
    color: "black",
    marginLeft: 12,
    color: Colors.blue,
  },
  wrapIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerIcon: {
    padding: 7,
    marginLeft: 7,
  },
});

export default MainNavigation;
