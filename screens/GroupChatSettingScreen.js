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

import UserItem from "../components/UserItem";
import { Colors } from "../constants/colors";
import { setStoreGuestChat } from "../store/ActionSlice";

function GroupChatSettingScreen({ navigation, route }) {
  const { guestChatData, storedUsers, chatsData, userData } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();

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

  return (
    <View style={styles.contain}>
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

        <TouchableOpacity style={styles.addUserBtn}>
          <Ionicons name="person-add-sharp" size={28} color={Colors.blue} />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <View
          style={{
            borderBottomColor: Colors.border,
            borderBottomWidth: 1,
            marginBottom: 7,
          }}
        >
          <Text
            style={styles.participantsText}
          >{`${guestChatData.guestChatDataId.length} Participants`}</Text>
        </View>

        <FlatList
          data={guestChatData.guestChatDataId}
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
                onPress={() => userData.userId != item && handleNavigate(data)}
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
