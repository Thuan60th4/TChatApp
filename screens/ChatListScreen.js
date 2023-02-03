import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import UserItem from "../components/UserItem";
import { Colors } from "../constants/colors";
import { setStoreFriendChat } from "../store/ActionSlice";

function ChatListScreen({ navigation }) {
  const { storedUsers, chatsData, userData } = useSelector((state) => state);
  const dispatch = useDispatch();

  const allChatData = Object.values(chatsData).sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}> Chats</Text>
      <FlatList
        data={allChatData}
        renderItem={(item) => {
          const chatData = item.item;
          const chatId = chatData.key;
          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId
          );
          const otherUser = storedUsers[otherUserId];
          //phải thêm dòng này vì lúc nó dispatch(setStoredUsers(userSnapshotData));
          //  nó render lại component này rồi nhưng cái dispatch(setChatsData(chatsData));
          // thì chưa nên nó chưa có otherUser nên phải return về rỗng ko nó sẽ bị lỗi
          if (!otherUser) return;
          return (
            <UserItem
              data={otherUser}
              index={item.index}
              subTitle={chatData.lastMessageText || "This will be a message..."}
              style={{ marginLeft: 15 }}
              onPress={() => {
                dispatch(setStoreFriendChat(otherUser));
                navigation.navigate("chatDetail", chatId);
              }}
            />
          );
        }}
        keyExtractor={(item) => item.key}
        style={{
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 35,
    paddingBottom: 10,
  },
});

export default ChatListScreen;
