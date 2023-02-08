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
          headerLeft: () => (
            <TouchableOpacity>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          ),
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
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: Colors.space,
          },
          // headerBackTitleStyle :{color: Colors.blue},
          headerTintColor: Colors.blue,
          headerBackTitleVisible: false,
          headerShadowVisible: false,
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
          presentation: "transparentModal",
          title: "New Chat",
          headerBackTitleVisible: false,
          headerShadowVisible: false,

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

  headerIcon: {
    padding: 7,
    marginTop: 2,
    marginLeft: 7,
    marginRight: 10,
  },
});

export default MainNavigation;
