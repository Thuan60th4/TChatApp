import { useActionSheet } from "@expo/react-native-action-sheet";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import UserItem from "../components/UserItem";
import { Colors } from "../constants/colors";
import { removeOnechat, removeUserFromChat } from "../firebase";
import { setStoreGuestChat } from "../store/ActionSlice";
import { handleActionSheet } from "../utils/handleActionSheetUser";

function MembersScreen({ navigation, route }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const { storedUsers, chatsData, userData } = useSelector((state) => state);
  const dispatch = useDispatch();

  let chatListUsers =
    chatsData[route.params]?.newUsers || chatsData[route.params]?.users || [];

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

  return (
    <View style={styles.contain}>
      <FlatList
        style={{ flex: 1 }}
        data={chatListUsers}
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
              subTitle={data.email}
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
    </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    flex: 1,
    backgroundColor: Colors.space,
  },
});

export default MembersScreen;
