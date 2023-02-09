import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

function UserItem({
  index,
  onPress,
  avatar,
  chatName,
  subTitle,
  style,
  isGroupChat = undefined,
  isChecked,
}) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image
        style={styles.image}
        source={
          avatar ? { uri: avatar } : require("../assets/image/noAvatar.jpeg")
        }
      />
      <View
        style={[
          styles.InfoUser,
          index > 0 && {
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderTopColor: Colors.border,
            borderBottomColor: Colors.border,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{chatName}</Text>
          <Text numberOfLines={1} style={styles.email}>
            {subTitle}
          </Text>
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
