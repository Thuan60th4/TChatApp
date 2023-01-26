import { Button, StyleSheet, Text, View } from "react-native";

function ChatListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>ChatListScreen</Text>
      <Button title="Go to chat " onPress={() => navigation.navigate("chatDetail")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
  },
});

export default ChatListScreen;
