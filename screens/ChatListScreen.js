import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

import UserItem from "../components/UserItem";
import { Colors } from "../constants/colors";
import { setStoreGuestChat } from "../store/ActionSlice";

function ChatListScreen({ navigation }) {
  // const [numberOfUsers, setNumberOfUsers] = useState();
  const { storedUsers, chatsData, userData } = useSelector((state) => state);
  const dispatch = useDispatch();

  const allChatData = Object.values(chatsData).sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  // useEffect(() => {
  //   setNumberOfUsers(allChatData.length);

  //   if (numberOfUsers > allChatData.length) {
  //     dispatch(setLoadRemoveUsers(Math.random()));
  //   }
  // }, [allChatData.length]);

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
          let about = "";

          if (chatData.isGroup) {
            name = chatData.title;
            image = chatData.avatar;
            // image = require("../assets/image/groupAvatar.png");
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
            about = otherUser.about;
          }
          return (
            <UserItem
              isGroupList={chatData.isGroup}
              avatar={image}
              chatName={name}
              subTitle={chatData.lastMessageText}
              style={{ marginLeft: 15 }}
              onPress={() => {
                dispatch(
                  setStoreGuestChat({
                    title: name,
                    guestChatDataId: chatData.newUsers || chatData.users,
                    avatar: image,
                    about: about,
                    isGroup: chatData.isGroup,
                    key: chatData.key,
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
