import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";

import UserItem from "../components/UserItem";
import { Colors } from "../constants/colors";
import { setStoreGuestChat } from "../store/ActionSlice";
import { removeOnechat, removeUserFromChat } from "../firebase";
import CustomButtom from "../components/CustomButtom";
import { handleActionSheet } from "../utils/handleActionSheetUser";

function GroupChatSettingScreen({ navigation, route }) {
  const { showActionSheetWithOptions } = useActionSheet();

  const { guestChatData, storedUsers, chatsData, userData } = useSelector(
    (state) => state
  );

  let chatListUsers =
    chatsData[route.params]?.newUsers || chatsData[route.params]?.users || [];

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // if (!chatListUsers.includes(userData.userId)) {
  //   //   // console.log(chatListUsers);
  //   //   dispatch(setLoadRemoveUsers(Math.random()));
  //   //   // navigation.replace("home");
  //   // }

  //   console.log(chatListUsers);
  // }, [chatsData]);

  const handleNavigate = (data) => {
    dispatch(
      setStoreGuestChat({
        title: `${data.firstName} ${data.lastName}`,
        guestChatDataId: [data.userId],
        avatar: data.avatar,
        about: data.about,
      })
    );
    navigation.popToTop();
    if (data.chatId) navigation.push("chatDetail", data.chatId);
    else navigation.push("chatDetail");
  };

  const handleRemoveUser = async (data) => {
    const guestChatDataId = chatListUsers.filter((uid) => uid != data.userId);
    const messageText = `${userData.lastName} removed ${data.fullName} from the chat`;

    await removeUserFromChat(
      route.params,
      userData.userId,
      guestChatDataId,
      messageText
    );
    await removeOnechat(route.params, data.userId);
  };

  const handleLeaveGroup = async () => {
    const guestChatDataId = chatListUsers.filter(
      (uid) => uid != userData.userId
    );
    const messageText = `${userData.fullName} left the group chat`;

    await removeUserFromChat(
      route.params,
      userData.userId,
      guestChatDataId,
      messageText
    );

    await removeOnechat(route.params, userData.userId);

    navigation.navigate("home");
  };

  return (
    <View style={styles.contain}>
      <View style={{ flex: 1 }}>
        <View style={styles.infoContact}>
          <Image
            style={styles.avatar}
            source={
              guestChatData.avatar
                ? { uri: guestChatData.avatar }
                : require("../assets/image/groupAvatar.png")
            }
          />
          <Text style={styles.name}>{guestChatData.title}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("modalchange", route.params)}
          >
            <Text style={styles.changeNameImage}>Change name or image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addUserBtn}
            onPress={() =>
              navigation.navigate("newChat", {
                chatId: route.params,
                isGroupChat: true,
              })
            }
          >
            <Ionicons name="person-add-sharp" size={28} color={Colors.blue} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 30,
            // flex: 1,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              borderBottomColor: Colors.border,
              borderBottomWidth: 1,
              marginBottom: 7,
            }}
          >
            <Text
              style={styles.participantsText}
            >{`${chatListUsers.length} Participants`}</Text>
          </View>
          <FlatList
            // style={{ flex: 1 }}
            data={chatListUsers.slice(0, 4)}
            renderItem={({ item }) => {
              let data = storedUsers[item];
              if (!data) return;

              let image = data.avatar;
              let name =
                userData.userId != item
                  ? `${data.firstName} ${data.lastName}`
                  : "you";

              const hitoryConversation = Object.values(chatsData).find(
                (data) =>
                  !data.isGroup &&
                  userData.userId != item &&
                  data.users.includes(item)
              );
              if (hitoryConversation) {
                data = { ...data, chatId: hitoryConversation.key };
              }
              return (
                <UserItem
                  avatar={image}
                  chatName={name}
                  type={userData.userId != item && "link"}
                  size={45}
                  style={{ marginLeft: 15 }}
                  onPress={() =>
                    userData.userId != item &&
                    handleActionSheet(
                      data,
                      showActionSheetWithOptions,
                      handleNavigate,
                      handleRemoveUser
                    )
                  }
                />
              );
            }}
          />
          {chatListUsers.length > 4 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("members", route.params)}
            >
              <Text
                style={{
                  color: Colors.lightGrey,
                  fontSize: 17,
                  marginTop: 10,
                  alignSelf: "center",
                }}
              >
                View all members
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <CustomButtom
        style={{ backgroundColor: "red" }}
        onPress={handleLeaveGroup}
      >
        Leave chat
      </CustomButtom>
    </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: Colors.space,
    padding: 15,
  },
  infoContact: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 12,
  },
  changeNameImage: {
    fontSize: 17,
    color: Colors.blue,
  },

  addUserBtn: {
    backgroundColor: Colors.border,
    padding: 7,
    borderRadius: 50,
    marginTop: 20,
  },

  participantsText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    paddingBottom: 10,
  },
});

export default GroupChatSettingScreen;
