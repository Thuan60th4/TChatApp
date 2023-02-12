import { useCallback, useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";

import { Colors } from "../constants/colors";
import { setStoreGuestChat } from "../store/ActionSlice";
import { openLibraryImage } from "../utils/accessImage";
import { updateChat, uploadImageToFirebase } from "../firebase";
import { ActivityIndicator } from "react-native";

function ModalChangeScreen({ navigation, route }) {
  const { guestChatData } = useSelector((state) => state);
  const [textInputValue, setTextInputValue] = useState(guestChatData.title);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleUpdateDatabase = useCallback(async () => {
    try {
      if (textInputValue) {
        let chatData = {};
        setLoading(true);
        if (imgUrl) {
          const urlImg = await uploadImageToFirebase(imgUrl, "ChatPics");
          chatData.avatar = urlImg;
        }

        if (textInputValue != guestChatData.title || imgUrl) {
          chatData.title = textInputValue;
          dispatch(
            setStoreGuestChat({
              ...guestChatData,
              ...chatData,
            })
          );
          await updateChat(route.params, chatData);
        }
        navigation.goBack();
      } else {
        Alert.alert("Invalid group name", "Please type a invalid group name");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [textInputValue, imgUrl, guestChatData, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleUpdateDatabase}>
          <Text style={styles.editText}>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [textInputValue, imgUrl]);

  const handleUpdateImage = async () => {
    const result = await openLibraryImage();
    if (result) {
      setImgUrl(result);
    }
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.contain}>
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        )}

        <View style={styles.infoContact}>
          <TouchableOpacity onPress={handleUpdateImage}>
            <Image
              style={styles.avatar}
              source={
                imgUrl || guestChatData.avatar
                  ? { uri: imgUrl || guestChatData.avatar }
                  : require("../assets/image/groupAvatar.png")
              }
            />
            <View style={styles.containIcon}>
              <FontAwesome name="pencil" size={17} color="black" />
            </View>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={textInputValue}
            onChangeText={setTextInputValue}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  editText: {
    fontSize: 19,
    color: "black",
    marginHorizontal: 12,
    color: Colors.blue,
  },

  contain: {
    flex: 1,
    backgroundColor: Colors.space,
    paddingHorizontal: 30,
  },
  infoContact: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  containIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    padding: 8,
  },
  textInput: {
    width: "100%",
    fontSize: 18,
    backgroundColor: Colors.lightGrey,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 25,
    borderRadius: 10,
  },
});

export default ModalChangeScreen;
