import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/UserItem";

import { Colors } from "../constants/colors";
import { setStoreGuestChat } from "../store/ActionSlice";

function ContactScreen({ navigation }) {
  const { guestChatData, userData } = useSelector((state) => state);
  const groupCommon = useSelector((state) => {
    const groupChatCommon = Object.values(state.chatsData).filter((chat) => {
      const chatList = chat.newUsers || chat.users;
      return (
        chat.isGroup &&
        chatList.includes(
          guestChatData.guestChatDataId.find((id) => id != userData.userId)
        )
      );
    });

    return groupChatCommon;
  });


  const dispatch = useDispatch();

  return (
    <View style={styles.contain}>
      <View style={styles.infoContact}>
        <Image
          style={styles.avatar}
          source={
            guestChatData.avatar
              ? { uri: guestChatData.avatar }
              : require("../assets/image/noAvatar.jpeg")
          }
        />
        <Text style={styles.name}>{guestChatData.title}</Text>
        {guestChatData.about && (
          <Text style={styles.about} numberOfLines={2}>
            {guestChatData.about}
          </Text>
        )}
      </View>
      <View style={{ marginTop: 30 }}>
        <Text style={styles.groupCommonText}>{`${groupCommon.length} ${
          groupCommon.length > 1 ? "Groups" : "Group"
        } In Common`}</Text>

        <FlatList
          data={groupCommon}
          renderItem={({ item }) => {
            const avatar = item.avatar;
            return (
              <UserItem
                chatName={item.title}
                subTitle={item.lastMessageText}
                avatar={avatar}
                type="link"
                isGroupList={true}
                onPress={() => {
                  dispatch(
                    setStoreGuestChat({
                      title: item.title,
                      guestChatDataId: item.users,
                      avatar: avatar,
                      isGroup: item.isGroup,
                    })
                  );
                  navigation.popToTop();
                  navigation.push("chatDetail", item.key);
                }}
              />
            );
          }}
        />
      </View>
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
  about: {
    maxWidth: "80%",
    color: Colors.lightGrey,
    fontSize: 17,
  },

  groupCommonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default ContactScreen;
