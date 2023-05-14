import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

function ReplyMessage({ name, message, onPress }) {
  return (
    <View style={styles.replyContain}>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.headerReply}>
          {name}
        </Text>
        <Text numberOfLines={1} style={styles.contentReply}>
          {message}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <AntDesign name="closecircleo" size={26} color={Colors.blue} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  replyContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.friendMessage,
    borderLeftColor: Colors.blue,
    borderLeftWidth: 5,
    paddingHorizontal: 20,
  },
  headerReply: {
    color: Colors.blue,
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 5,
  },
  contentReply: {
    fontSize: 16,
    color: "white",
    marginVertical: 8,
    maxWidth: "95%",
  },
});

export default ReplyMessage;
