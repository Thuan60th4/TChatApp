import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AwesomeAlert from "react-native-awesome-alerts";
import { useDispatch, useSelector } from "react-redux";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { openCameraImage, openLibraryImage } from "../utils/accessImage";
import { Colors } from "../constants/colors";
import IconButtom from "../components/IconButtom";
import {
  createChat,
  sendMessage,
  sendNotifications,
  uploadImageToFirebase,
} from "../firebase";
import Message from "../components/Message";
import ReplyMessage from "../components/ReplyMessage";
import { setStoreGuestChat } from "../store/ActionSlice";

function ChatDetailScreen({ route, navigation }) {
  const [textInputValue, setTextInputValue] = useState("");
  const [chatId, setChatId] = useState(route?.params);
  const [replying, setReplying] = useState();
  const [imageUri, setImageUri] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const flatlist = useRef();

  const { guestChatData, userData, storedUsers, messagesData, chatsData } =
    useSelector((state) => state);
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
  let chatListUsers;
  if (chatId) {
    chatListUsers =
      chatsData[chatId]?.newUsers || chatsData[chatId]?.users || [];
  }

  useEffect(() => {
    if (chatId && guestChatData.isGroup) {
      if (!chatListUsers.includes(userData.userId)) {
        navigation.navigate("home");
      }
    }
  }, [chatsData]);

  //title
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={styles.name}>{guestChatData.title}</Text>,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (!guestChatData.isGroup) navigation.navigate("contact", chatId);
            else if (chatId) {
              navigation.navigate("groupChatSetting", chatId);
            }
          }}
        >
          <Image
            style={styles.image}
            source={
              guestChatData.avatar
                ? { uri: guestChatData.avatar }
                : guestChatData.isGroup
                ? require("../assets/image/groupAvatar.png")
                : require("../assets/image/noAvatar.jpeg")
            }
          />
        </TouchableOpacity>
      ),
    });
  }, [guestChatData, chatId]);

  // send messages
  const handleSendMessage = useCallback(async () => {
    setTextInputValue("");
    setReplying();
    if (chatId) {
      await sendMessage(
        chatId,
        userData.userId,
        textInputValue,
        replying && replying.key
      );
      let sendListUsersNotifi = chatListUsers.filter(
        (uid) => uid != userData.userId
      );
      await sendNotifications(
        chatId,
        sendListUsersNotifi,
        guestChatData.isGroup
          ? `${guestChatData.title} : ${userData.fullName}`
          : userData.fullName,
        textInputValue
      );
    } else {
      //Nếu ko có chatId thì mới tạo chat mới
      const chatKey = await createChat(
        userData.userId,
        guestChatData.guestChatDataId.concat(userData.userId),
        textInputValue,
        "",
        guestChatData.title,
        guestChatData.isGroup
      );
      if (chatKey) {
        setChatId(chatKey);
        await sendNotifications(
          chatKey,
          guestChatData.guestChatDataId,
          guestChatData.isGroup
            ? `${guestChatData.title} : ${userData.fullName}`
            : userData.fullName,
          textInputValue
        );
      }
    }
  }, [textInputValue, chatId]);

  //open native feature

  const chooseImgFromLib = useCallback(async () => {
    const imageResult = await openLibraryImage();
    if (imageResult) {
      setImageUri(imageResult);
    }
  }, [imageUri]);

  const takePhoto = useCallback(async () => {
    const imageResult = await openCameraImage();
    if (imageResult) {
      setImageUri(imageResult);
    }
  }, [imageUri]);

  // Send image
  const handleUploadImage = useCallback(async () => {
    try {
      setLoading(true);
      const urlImg = await uploadImageToFirebase(imageUri, "ChatPics");

      if (chatId) {
        await sendMessage(
          chatId,
          userData.userId,
          "Image",
          replying && replying.key,
          urlImg
        );
        let sendListUsersNotifi = chatListUsers.filter(
          (uid) => uid != userData.userId
        );
        await sendNotifications(
          chatId,
          sendListUsersNotifi,
          guestChatData.isGroup
            ? `${guestChatData.title} : ${userData.fullName}`
            : userData.fullName,
          "Sent a picture"
        );
      } else {
        //Nếu ko có chatId thì mới tạo chat mới
        const chatKey = await createChat(
          userData.userId,
          guestChatData.guestChatDataId.concat(userData.userId),
          "Image",
          urlImg,
          guestChatData.title,
          guestChatData.isGroup
        );
        if (chatKey) {
          setChatId(chatKey);

          await sendNotifications(
            chatKey,
            guestChatData.guestChatDataId,
            guestChatData.isGroup
              ? `${guestChatData.title} : ${userData.fullName}`
              : userData.fullName,
            "Sent a picture"
          );
        }
      }
      setLoading(false);
      setReplying();
      setImageUri("");
    } catch (error) {
      console.log(error);
    }
  }, [imageUri]);

  return (
    <ImageBackground
      source={require("../assets/image/background.jpg")}
      style={styles.conatiner}
    >
      <KeyboardAvoidingView
        style={styles.conatiner}
        behavior={Platform.OS === "ios" ? "padding" : ""}
        keyboardVerticalOffset={74}
      >
        <View style={styles.conatiner}>
          {/* Message */}
          {chatId ? (
            <FlatList
              ref={flatlist}
              onContentSizeChange={() =>
                flatlist.current.scrollToEnd({ animated: false })
              }
              // onLayout={() => flatlist.current.scrollToEnd({ animated: false })}
              data={messageLists}
              renderItem={({ item, index }) => {
                let type =
                  item.sentBy == userData.userId
                    ? "ownMessage"
                    : "friendMessage";

                if (item.type == "info") type = item.type;

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

                let name = "";
                let avatar = "";

                if (
                  type != "info" &&
                  guestChatData.isGroup &&
                  item.sentBy != userData.userId
                ) {
                  let userDetail = storedUsers[item.sentBy];
                  name = userDetail.lastName;
                  avatar = userDetail.avatar;
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
                    imageMessage={item.imageUrl}
                    sentByName={name}
                    avatar={avatar}
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

        {/* Reply */}
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

        {/* Input */}
        <View style={styles.wrapInputUser}>
          <IconButtom
            onPress={chooseImgFromLib}
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
                Icon={MaterialCommunityIcons}
                name="send"
                size={20}
                color="white"
                onPress={handleSendMessage}
              />
            </View>
          ) : (
            <IconButtom
              Icon={Feather}
              style={styles.icon}
              name="camera"
              size={25}
              color={Colors.blue}
              onPress={takePhoto}
            />
          )}
        </View>

        {/* Modal */}
        <AwesomeAlert
          show={!!imageUri}
          title="Send image?"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Cancel"
          confirmText="Send image"
          titleStyle={{ fontWeight: "bold", marginBottom: 10 }}
          confirmButtonColor={Colors.primary}
          cancelButtonColor="red"
          onCancelPressed={() => setImageUri("")}
          onDismiss={() => setImageUri("")}
          onConfirmPressed={handleUploadImage}
          customView={
            <View>
              {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
              ) : (
                imageUri && (
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: 200, height: 200 }}
                  />
                )
              )}
            </View>
          }
        />
      </KeyboardAvoidingView>
    </ImageBackground>
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
