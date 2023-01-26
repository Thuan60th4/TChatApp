import {
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";
import { useState } from "react";

function ChatDetailScreen() {
  const [textInputValue, setTextInputValue] = useState("");
  return (
    <KeyboardAvoidingView
      style={styles.conatiner}
      contentContainerStyle={styles.conatiner}
      behavior={Platform.OS == "ios" ? "position" : ""}
    >
      <TouchableWithoutFeedback
        style={styles.conatiner}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.conatiner}>
          <ImageBackground
            source={require("../assets/image/background.jpg")}
            style={styles.conatiner}
          ></ImageBackground>
          <View style={styles.wrapInputUser}>
            <Ionicons
              style={styles.icon}
              name="add"
              size={35}
              color={Colors.blue}
            />
            <TextInput
              style={styles.textInput}
              value={textInputValue}
              onChangeText={setTextInputValue}
            />
            {textInputValue ? (
              <View style={styles.iconSend}>
                <MaterialCommunityIcons name="send" size={20} color="white" />
              </View>
            ) : (
              <Feather
                style={styles.icon}
                name="camera"
                size={25}
                color={Colors.blue}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  conatiner: { flex: 1 },
  wrapInputUser: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 15,
    paddingBottom: Platform.OS == "ios" ? 40 : 15,
    backgroundColor: "rgb(69, 53, 32)",
  },
  icon: {
    width: 30,
    textAlign: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginHorizontal: 10,
    borderRadius: 40,
    backgroundColor: Colors.lightGrey,
  },
  iconSend: {
    backgroundColor: Colors.blue,
    padding: 6,
    borderRadius: 50,
  },
});

export default ChatDetailScreen;
