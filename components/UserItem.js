import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

function UserItem({
  onPress,
  avatar,
  chatName,
  subTitle,
  style,
  isGroupChat = undefined,
  isGroupList,
  isChecked,
  type,
  size, //chỉ có trong groupchat thôi
}) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image
        style={[styles.image, size && { width: size, height: size }]}
        source={
          avatar
            ? { uri: avatar }
            : isGroupList
            ? require("../assets/image/groupAvatar.png")
            : require("../assets/image/noAvatar.jpeg")
        }
      />
      <View
        style={[
          styles.InfoUser,
          size && { minHeight: size + 15 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{chatName}</Text>
          {subTitle && (
            <Text numberOfLines={1} style={styles.email}>
              {subTitle}
            </Text>
          )}
        </View>
        {isGroupChat && (
          <View
            style={[
              styles.checkboxContainer,
              isChecked && {
                backgroundColor: Colors.primary,
              },
            ]}
          >
            <Ionicons name="checkmark" size={18} color="black" />
          </View>
        )}
        {type == "link" && (
          <Ionicons name="chevron-forward" size={24} color={Colors.grey} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 55,
    width: 55,
    borderRadius: 30,
    marginRight: 15,
  },
  InfoUser: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  email: {
    fontSize: 16,
    color: Colors.grey,
  },

  checkboxContainer: {
    padding: 2,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 50,
  },
});

export default UserItem;
