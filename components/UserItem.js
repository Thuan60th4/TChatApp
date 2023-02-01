import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { Colors } from "../constants/colors";
import { storeFriendChat } from "../store/ActionSlice";

function UserItem({ data, index }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleNavigate = () => {
    dispatch(storeFriendChat(data));
    navigation.navigate("chatDetail");
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <Image
        style={styles.image}
        source={
          data.avatar
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
            borderColor: Colors.border,
          },
        ]}
      >
        <Text style={styles.name}>{`${data.firstName} ${data.lastName}`}</Text>
        <Text style={styles.email}>{data.email}</Text>
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
