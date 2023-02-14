import { Easing, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

import ChatListScreen from "../../screens/ChatListScreen";
import ChatDetailScreen from "../../screens/ChatDetailScreen";
import SettingScreen from "../../screens/SettingScreen";
import { Colors } from "../../constants/colors";
import NewChatScreen from "../../screens/NewChatScreen";
import IconButtom from "../../components/IconButtom";
import ContactScreen from "../../screens/ContactScreen";
import GroupChatSettingScreen from "../../screens/GroupChatSettingScreen";
import ModalChangeScreen from "../../screens/ModalChangeScreen";
import MembersScreen from "../../screens/MembersScreen";

const Stack = createStackNavigator();
const Bottom = createBottomTabNavigator();

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
          headerTitle: "",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          headerLeft: () => <Text style={styles.headerText}>Chats</Text>,
          headerRight: () => (
            <IconButtom
              onPress={() => navigation.navigate("newChat")}
              Icon={FontAwesome}
              style={styles.headerIcon}
              name="pencil-square-o"
              size={22}
              color={Colors.blue}
            />
          ),
        })}
      />
      <Bottom.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          title: "Settings",
          headerTitle: "",
          headerLeft: () => <Text style={styles.headerText}>Settings</Text>,
          tabBarIcon: ({ size, color }) => (
            <SimpleLineIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Bottom.Navigator>
  );
}

function MainNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: true, // giúp android cũng có thể gàt ngang để trở về như ios
        headerTitleAlign: "center",
        headerTintColor: Colors.blue,
        headerStyle: {
          backgroundColor: Colors.space,
        },
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
          // headerBackTitleStyle :{color: Colors.blue},
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />

      <Stack.Screen
        name="contact"
        component={ContactScreen}
        options={{
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="groupChatSetting"
        component={GroupChatSettingScreen}
        options={{
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitle: "",
        }}
      />

      <Stack.Screen
        name="members"
        component={MembersScreen}
        options={{
          headerBackTitleVisible: false,
          headerBackTitleStyle: { color: Colors.blue },
          headerTitleStyle: { color: "white" },
        }}
      />

      <Stack.Screen
        name="modalchange"
        component={ModalChangeScreen}
        options={({ navigation }) => ({
          presentation: "modal",
          headerShadowVisible: false,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.editText}>Cancel</Text>
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name="newChat"
        component={NewChatScreen}
        options={({ navigation }) => ({
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
          presentation: "transparentModal",
          title: "New Chat",
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitleStyle: { color: "white" },
          headerLeft: "",
          headerRight: () => (
            <IconButtom
              onPress={() => navigation.goBack()}
              Icon={AntDesign}
              style={[styles.headerIcon, { marginRight: 10 }]}
              name="closecircle"
              size={24}
              color={Colors.grey}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  editText: {
    fontSize: 19,
    color: "black",
    marginHorizontal: 12,
    color: Colors.blue,
  },

  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 35,
    marginLeft: 6,
  },
  headerIcon: {
    padding: 7,
    marginTop: 2,
    marginLeft: 7,
    marginRight: 10,
  },
});

export default MainNavigation;
