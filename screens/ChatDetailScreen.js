import {
  Image,
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
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import IconButtom from "../components/IconButtom";
import { createChat } from "../firebase";

function ChatDetailScreen({ route, navigation }) {
  const { friendChatData, userData } = useSelector((state) => state);
  const [textInputValue, setTextInputValue] = useState("");
  const [chatId, setChatId] = useState(route?.params);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={styles.image}
            source={
              friendChatData.avatar
                ? { uri: friendChatData.avatar }
                : require("../assets/image/noAvatar.jpeg")
            }
          />
          <Text
            style={styles.name}
          >{`${friendChatData.firstName} ${friendChatData.lastName}`}</Text>
        </View>
      ),
    });
  }, [friendChatData]);

  const handleSendMessage = async () => {
    const chatKey = await createChat(userData.userId, [
      userData.userId,
      friendChatData.userId,
    ]);
    if (chatKey) {
      setChatId(chatKey);
    }
    setTextInputValue("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.conatiner}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={74}
    >
      <TouchableWithoutFeedback
        style={styles.conatiner}
        onPress={Keyboard.dismiss}
      >
        <View style={styles.conatiner}>
          <ImageBackground
            source={require("../assets/image/background.jpg")}
            style={styles.conatiner}
          >
            {!chatId && (
              <View style={styles.noteNewChat}>
                <Text>This is new chat.Send something!</Text>
              </View>
            )}
          </ImageBackground>
          <View style={styles.wrapInputUser}>
            <IconButtom
              Icon={Ionicons}
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
                <IconButtom
                  onPress={handleSendMessage}
                  Icon={MaterialCommunityIcons}
                  name="send"
                  size={20}
                  color="white"
                />
              </View>
            ) : (
              <IconButtom
                Icon={Feather}
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
  conatiner: {
    flex: 1,
  },
  noteNewChat: {
    backgroundColor: "#ffffffb3",
    borderRadius: 6,
    padding: 5,
    marginVertical: 10,
    borderColor: "#E2DACC",
    borderWidth: 1,
    alignSelf: "center",
  },
  wrapInputUser: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: Platform.OS == "ios" ? 40 : 15,
    backgroundColor: Colors.space,
  },

  icon: {
    width: 30,
    textAlign: "center",
  },

  textInput: {
    flex: 1,
    fontSize: 18,
    color: "white",
    backgroundColor: "rgb(55,55,55)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginHorizontal: 10,
    borderRadius: 40,
  },

  iconSend: {
    backgroundColor: Colors.blue,
    padding: 6,
    borderRadius: 50,
  },
  image: {
    height: 37,
    width: 37,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default ChatDetailScreen;
