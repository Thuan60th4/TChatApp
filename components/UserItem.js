import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/colors";

function UserItem({ data, index,onPress, subTitle, style }) {

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image
        style={styles.image}
        source={
          data?.avatar
            ? { uri: data.avatar }
            : require("../assets/image/noAvatar.jpeg")
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
        <Text style={styles.name}>{`${data?.firstName} ${data.lastName}`}</Text>
        <Text numberOfLines={1} style={styles.email}>{subTitle || data.email}</Text>
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
});

export default UserItem;
