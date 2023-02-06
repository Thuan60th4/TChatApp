import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";
import { useCallback, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import IconButtom from "../components/IconButtom";
import { createChat, sendTextMessage } from "../firebase";
import { FlatList } from "react-native-gesture-handler";
import Message from "../components/Message";
import ReplyMessage from "../components/ReplyMessage";

function ChatDetailScreen({ route, navigation }) {
  const [textInputValue, setTextInputValue] = useState("");
  const [chatId, setChatId] = useState(route?.params);
  const [replying, setReplying] = useState();

  const { friendChatData, userData, storedUsers, messagesData } = useSelector(
    (state) => state
  );
  const messageLists = useSelector((state) => {
    if (!chatId) return [];
    const messagesData = state.messagesData[chatId];
    const allMessages = [];
    for (const key in messagesData) {
      allMessages.push({
        key,
        ...messagesData[key],
      });
    }
    return allMessages;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text
          style={styles.name}
        >{`${friendChatData.firstName} ${friendChatData.lastName}`}</Text>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <Image
            style={styles.image}
            source={
              friendChatData.avatar
                ? { uri: friendChatData.avatar }
                : require("../assets/image/noAvatar.jpeg")
            }
          />
        </TouchableOpacity>
      ),
    });
  }, [friendChatData]);

  const handleSendMessage = useCallback(async () => {
    setTextInputValue("");
    setReplying();
    if (!chatId) {
      //Nếu ko có chatId thì mới tạo chat mới
      const chatKey = await createChat(
        userData.userId,
        [userData.userId, friendChatData.userId],
        textInputValue
      );
      if (chatKey) {
        setChatId(chatKey);
      }
    } else {
      await sendTextMessage(
        chatId,
        userData.userId,
        textInputValue,
        replying && replying.key
      );
    }
  }, [textInputValue, chatId]);

  return (
    <KeyboardAvoidingView
      style={styles.conatiner}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={74}
    >
      <ImageBackground
        source={require("../assets/image/background.jpg")}
        style={styles.conatiner}
      >
        <View style={styles.conatiner}>
          {chatId ? (
            <FlatList
              data={messageLists}
              renderItem={({ item, index }) => {
                const type =
                  item.sentBy == userData.userId
                    ? "ownMessage"
                    : "friendMessage";
                let messageReplyAbove;
                if (item.messageReplyId) {
                  let replyUserKey =
                    messagesData[chatId][item.messageReplyId].sentBy;
                  messageReplyAbove = {
                    text: messagesData[chatId][item.messageReplyId].text,
                    lastName:
                      userData.userId == storedUsers[replyUserKey].userId
                        ? "you"
                        : storedUsers[replyUserKey].lastName,
                  };
                }

                return (
                  <Message
                    type={type}
                    index={index.toString()}
                    messageId={item.key}
                    chatId={chatId}
                    replyMessageAbove={messageReplyAbove}
                    time={new Date(item.sentAt)
                      .toLocaleTimeString()
                      .slice(0, 5)}
                    onSelectReply={() => {
                      setReplying({ ...item, ...storedUsers[item.sentBy] });
                    }}
                  >
                    {item.text}
                  </Message>
                );
              }}
              keyExtractor={(item) => item.key}
              ListFooterComponent={() => (
                <View style={{ marginBottom: 20 }}></View>
              )}
            />
          ) : (
            <View style={styles.noteNewChat}>
              <Text>This is new chat.Send something!</Text>
            </View>
          )}
        </View>

        {replying && (
          <ReplyMessage
            name={
              replying.userId == userData.userId
                ? "Replying yourself"
                : `${replying.lastName}`
            }
            message={replying.text}
            onPress={() => {
              setReplying();
            }}
          />
        )}

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
            multiline
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
      </ImageBackground>
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
    paddingHorizontal: 16,
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
