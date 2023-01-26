import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import ChatListScreen from "../screens/ChatListScreen";
import ChatDetailScreen from "../screens/ChatDetailScreen";
import SettingScreen from "../screens/SettingScreen";
import { Colors } from "../constants/colors";

const Stack = createStackNavigator();
const Bottom = createBottomTabNavigator();

function BottomTab() {
  return (
    <Bottom.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "black",
        },
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 23, color: "white" },
        tabBarStyle: { backgroundColor: "black" },
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Bottom.Screen
        name="ChatListScreen"
        component={ChatListScreen}
        options={{
          title: "Chats",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          headerLeft: () => <Text style={styles.editText}>Edit</Text>,
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
              <TouchableOpacity>
                <FontAwesome
                  style={[styles.headerIcon, { marginTop: 2 }]}
                  name="pencil-square-o"
                  size={22}
                  color={Colors.blue}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
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

function MainNavigation() {
  return (
    <Stack.Navigator>
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
            backgroundColor: "rgb(69, 53, 32)",
          },
        }}
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
