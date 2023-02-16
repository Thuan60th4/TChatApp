import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";

import { removeOnechat, removeUserFromChat } from "../firebase";

function RightDeleteBtn({ chatData }) {
  const { userData } = useSelector((state) => state);

  let chatListUsers = chatData.newUsers || chatData.users;

  const handleLeaveGroup = async () => {
    const guestChatDataId = chatData.isGroup
      ? chatListUsers.filter((uid) => uid != userData.userId)
      : [];
    const messageText = `${userData.fullName} left the group chat`;

    await removeUserFromChat(
      chatData.key,
      userData.userId,
      guestChatDataId,
      messageText
    );
    if (chatData.isGroup) await removeOnechat(chatData.key, userData.userId);
    else {
      for (const usersId of chatListUsers) {
        await removeOnechat(chatData.key, usersId);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLeaveGroup}
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 70,
        backgroundColor: "red",
      }}
    >
      <MaterialIcons name="delete" size={40} color="white" />
    </TouchableOpacity>
  );
}

export default RightDeleteBtn;
