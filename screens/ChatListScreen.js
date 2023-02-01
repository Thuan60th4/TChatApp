import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

function ChatListScreen() {
  const { userData, chatsData } = useSelector((state) => state);
  return (
    <View style={styles.container}>
      <FlatList
        data={chatsData}
        renderItem={(item) => <Text style={{ color: "white" }}>hi</Text>}
        keyExtractor={(item) => item.key}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export default ChatListScreen;
