import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";

import { Colors } from "../constants/colors";
import { searchUsers } from "../firebase/auth";
import UserItem from "../components/UserItem";

function NewChatScreen() {
  const [searchValue, setSearchValue] = useState("");
  const [listUsers, setListUsers] = useState();
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (searchValue.trim()) {
      const timer = setTimeout(async () => {
        setShowLoading(true);
        const result = await searchUsers(searchValue);
        setListUsers(Object.values(result));
        setShowLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setListUsers();
    }
  }, [searchValue]);
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={(e) => setSearchValue(e)}
          value={searchValue.trim()}
          showLoading={showLoading}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.inputContainer}
          rightIconContainerStyle={{ paddingLeft: 7 }}
          searchIcon={{ iconStyle: { fontSize: 25 } }}
          clearIcon={{
            style: styles.clearXIcon,
          }}
        />

        {searchValue &&
          listUsers &&
          (listUsers.length < 1 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="question"
                size={55}
                color={Colors.lightGrey}
                style={styles.noResultsIcon}
              />
              <Text style={styles.noResultsText}>No users found!</Text>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                paddingHorizontal: 21,
                marginTop: 15,
              }}
            >
              <FlatList
                data={listUsers}
                renderItem={(item) => (
                  <UserItem data={item.item} index={item.index} />
                )}
                keyExtractor={(item) => item.userId}
                style={{
                  borderTopColor: Colors.border,
                  borderTopWidth: 0.5,
                }}
              />
            </View>
          ))}

        {!searchValue && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="users"
              size={55}
              color={Colors.lightGrey}
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsText}>
              Enter a name to search for a user!
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.space,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    paddingHorizontal: 20,
  },
  inputContainer: {
    borderRadius: 10,
    backgroundColor: "rgb(55,55,55)",
    paddingVertical: 0,
  },
  clearXIcon: {
    padding: 4,
    borderRadius: 50,
    backgroundColor: "#4f4e4e",
    marginLeft: 15,
  },
  noResultsIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    color: Colors.lightGrey,
    fontSize: 20,
    letterSpacing: 0.3,
  },
});

export default NewChatScreen;
