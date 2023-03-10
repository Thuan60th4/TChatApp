import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../constants/colors";
import { addUserToChat, searchUsers } from "../firebase";
import UserItem from "../components/UserItem";
import { setStoreGuestChat } from "../store/ActionSlice";

function NewChatScreen({ navigation, route }) {
  const { userData, chatsData } = useSelector((state) => state);

  const [searchValue, setSearchValue] = useState("");
  const [listUsers, setListUsers] = useState();
  const [showLoading, setShowLoading] = useState(false);
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const flatlist = useRef();

  const dispatch = useDispatch();

  const isGroupChat = route?.params?.isGroupChat;
  const chatId = route?.params?.chatId;
  let newUsers;
  let users;
  if (chatId) {
    newUsers = chatsData[chatId]?.newUsers || chatsData[chatId]?.users || [];
    users = chatsData[chatId]?.users || [];
  }


  //search users
  useEffect(() => {
    if (searchValue.trim()) {
      const timer = setTimeout(async () => {
        setShowLoading(true);
        const result = await searchUsers(searchValue);
        delete result[userData.userId];

        if (chatId) {
          for (const key in result) {
            if (newUsers.includes(key)) {
              delete result[key];
            }
          }
        }

        setListUsers(Object.values(result));
        setShowLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setListUsers();
    }
  }, [searchValue]);

  // create Group
  const handleCreateGroup = () => {
    dispatch(
      setStoreGuestChat({
        title: chatName,
        guestChatDataId: selectedUsers.map((item) => item.userId),
        isGroup: true,
      })
    );
    navigation.popToTop();
    navigation.navigate("chatDetail");
  };

  const createGroupBtn = () => {
    if (chatName.trim() && selectedUsers.length >= 1) handleCreateGroup();
    else {
      Alert.alert(
        "Invalid group",
        "Please enter a group name and add a few members"
      );
    }
  };

  //add users
  const handleAddUsers = async () => {
    if (selectedUsers.length >= 1) {
      const addList = selectedUsers.map((item) => item.userId);

      const newUsersList = newUsers.concat(addList);
      const usersList = users.concat(addList);

      let messageText;
      if (selectedUsers.length >= 2) {
        messageText = `${userData.lastName} added ${
          selectedUsers[0].fullName
        } and ${selectedUsers.length - 1} others to the chat`;
      } else {
        messageText = `${userData.lastName} added ${selectedUsers[0].fullName} to the chat`;
      }

      await addUserToChat(
        chatId,
        userData.userId,
        newUsersList,
        usersList,
        addList,
        messageText
      );
      navigation.goBack();
    }
  };

  //title
  if (chatId || isGroupChat) {
    useLayoutEffect(() => {
      navigation.setOptions({
        title: !chatId ? "New Chat" : "Add Users",
        headerLeft: () => (
          <TouchableOpacity onPress={!chatId ? createGroupBtn : handleAddUsers}>
            <Text
              style={[
                styles.createText,
                chatName.trim() &&
                  selectedUsers.length >= 1 && { color: Colors.blue },

                chatId && selectedUsers.length >= 1 && { color: Colors.blue },
              ]}
            >
              {!chatId ? "Create" : "Add"}
            </Text>
          </TouchableOpacity>
        ),
      });
    }, [chatName, selectedUsers]);
  }

  const handleNavigate = (data) => {
    if (!isGroupChat) {
      dispatch(
        setStoreGuestChat({
          title: `${data.firstName} ${data.lastName}`,
          guestChatDataId: [data.userId],
          avatar: data.avatar,
          about: data.about,
        })
      );
      if (data?.chatId) navigation.navigate("chatDetail", data.chatId);
      else navigation.navigate("chatDetail");
    } else {
      const listUsersChecked = selectedUsers
        .map((item) => item.userId)
        .includes(data.userId)
        ? selectedUsers.filter((user) => user.userId != data.userId)
        : selectedUsers.concat({
            avatar: data?.avatar,
            userId: data.userId,
            fullName: data.fullName,
          });

      setSelectedUsers(listUsersChecked);
    }
  };
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {isGroupChat && (
          <>
            {!chatId && (
              <TextInput
                style={styles.textInputGroupName}
                placeholder="Enter your name group"
                placeholderTextColor={Colors.grey}
                value={chatName}
                onChangeText={setChatName}
              />
            )}
            {selectedUsers.length >= 0 && (
              <View style={{ marginHorizontal: 20 }}>
                <FlatList
                  ref={flatlist}
                  onContentSizeChange={() => flatlist.current.scrollToEnd()}
                  horizontal={true}
                  data={selectedUsers}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() =>
                        setSelectedUsers((prev) =>
                          prev.filter((data) => data.userId != item.userId)
                        )
                      }
                    >
                      <Image
                        source={
                          item.avatar
                            ? { uri: item.avatar }
                            : require("../assets/image/noAvatar.jpeg")
                        }
                        style={styles.selectedUserImg}
                      />
                      <View
                        style={{
                          borderRadius: 12,
                          backgroundColor: "black",
                          position: "absolute",
                          top: 0,
                          right: 0,
                        }}
                      >
                        <Ionicons
                          name="close-circle"
                          size={21}
                          color={Colors.grey}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.userId}
                />
              </View>
            )}
          </>
        )}

        <SearchBar
          placeholder="Search..."
          onChangeText={(e) => !e.startsWith(" ") && setSearchValue(e)}
          value={searchValue}
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
                renderItem={({ item, index }) => {
                  const data = { ...item };
                  if (!isGroupChat) {
                    const hitoryConversation = Object.values(chatsData).find(
                      (data) =>
                        !data.isGroup && data.users.includes(item.userId)
                    );
                    if (hitoryConversation)
                      data.chatId = hitoryConversation.key;
                  }
                  return (
                    <UserItem
                      avatar={item.avatar}
                      chatName={`${item.firstName} ${item.lastName}`}
                      subTitle={item.email}
                      onPress={() => handleNavigate(data)}
                      isGroupChat={isGroupChat}
                      isChecked={selectedUsers
                        .map((item) => item.userId)
                        .includes(item.userId)}
                    />
                  );
                }}
                keyExtractor={(item) => item.userId}
                style={{
                  borderTopColor: Colors.border,
                  borderTopWidth: 1,
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

  textInputGroupName: {
    backgroundColor: Colors.nearlyWhite,
    fontSize: 17,
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },

  createText: {
    fontSize: 19,
    color: "black",
    marginLeft: 12,
    color: Colors.grey,
  },

  selectedUserImg: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
    marginVertical: 2,
  },
});

export default NewChatScreen;
