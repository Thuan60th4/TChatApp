import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import UserItem from "../components/UserItem";
import { Colors } from "../constants/colors";
import { setStoreGuestChat } from "../store/ActionSlice";

function ChatListScreen({ navigation }) {
  const { storedUsers, chatsData, userData } = useSelector((state) => state);
  const dispatch = useDispatch();

  const allChatData = Object.values(chatsData).sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Chats</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("newChat", { isGroupChat: true })}
      >
        <Text style={styles.newGroup}>New Group</Text>
      </TouchableOpacity>
      <FlatList
        data={allChatData}
        renderItem={(item) => {
          const chatData = item.item;
          let image = "";
          let name = "";
          if (chatData.isGroup) {
            name = chatData.chatName;
            image =
              "https://firebasestorage.googleapis.com/v0/b/tchatapp-c6b2c.appspot.com/o/profilePics%2Fb676832d-6f8c-48db-a20e-bd3fd53919db?alt=media&token=bed2edf7-7089-442e-b98f-64da8f445252";
          } else {
            const otherUserId = chatData.users.find(
              (uid) => uid !== userData.userId
            );
            const otherUser = storedUsers[otherUserId];
            //phải thêm dòng này vì lúc nó dispatch(setStoredUsers(userSnapshotData));
            //  nó render lại component này rồi nhưng cái dispatch(setChatsData(chatsData));
            // thì chưa nên nó chưa có otherUser nên phải return về rỗng ko nó sẽ bị lỗi
            if (!otherUser) return;
            image = otherUser.avatar;
            name = `${otherUser.firstName} ${otherUser.lastName}`;
          }
          return (
            <UserItem
              index={item.index}
              avatar={image}
              chatName={name}
              subTitle={chatData.lastMessageText}
              style={{ marginLeft: 15 }}
              onPress={() => {
                dispatch(
                  setStoreGuestChat({
                    title: name,
                    guestChatDataId: chatData.users.filter(
                      (id) => id != userData.userId
                    ),
                    avatar: image,
                    isGroup: chatData.isGroup,
                  })
                );
                navigation.navigate("chatDetail", chatData.key);
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
    marginLeft: 6,
  },
  newGroup: {
    color: Colors.blue,
    fontSize: 17.5,
    marginLeft: 8,
    marginBottom: 15,
  },
});

export default ChatListScreen;
