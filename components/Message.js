import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
  Image,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { Colors } from "../constants/colors";
import { useSelector } from "react-redux";
import { addHeartMessage } from "../firebase";
import { getDatabase, off, onValue, ref } from "firebase/database";
import { app } from "../firebase/initalFirebase";

const db = getDatabase();

function Message({
  type,
  index,
  messageId,
  chatId,
  replyMessageAbove,
  time,
  onSelectReply,
  imageMessage,
  children,
  sentByName,
  avatar,
}) {
  const { userData } = useSelector((state) => state);
  const [heartDataArray, setHeartDataArray] = useState([]);
  const [isHeart, setIsheart] = useState(false);

  const menuRef = useRef();
  const timePress = useRef();
  const heartValueAnimate = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isHeart) {
      Animated.timing(heartValueAnimate, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        // useNativeDriver: true, native drive là đẩy mấy cái luồng animation
        //  sang luồng native gốc để tối ưu hiệu năng nhưng nó chỉ hỗ trợ mấy cái mà ko bị thay đổi layout (transform,opacity,border,...)
        // }).start(() => (isAnimated.current = false));
      }).start();
    } else {
      heartValueAnimate.setValue(0);
    }
  }, [isHeart, heartValueAnimate]);

  const heartAnimation = {
    transform: [
      {
        scale: heartValueAnimate.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: heartDataArray.length > 0 ? [1, 2, 2, 1] : [0, 2, 2, 1],
        }),
      },
      {
        translateY: heartValueAnimate.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, -10, -10, 1],
        }),
      },
    ],
  };

  useEffect(() => {
    if (messageId) {
      var messageRef = ref(db, `messages/${chatId}/${messageId}`);
      onValue(messageRef, (messagesSnapshot) => {
        setHeartDataArray(messagesSnapshot?.val?.()?.heart || []);
      });
    }
    return () => off(messageRef);
  }, [messageId]);

  const updateValueHeart = async () => {
    let heartArray = [];
    if (heartDataArray.includes(userData.userId)) {
      heartArray = heartDataArray.filter((data) => data != userData.userId);
      setIsheart(false);
    } else {
      heartArray = [...heartDataArray, userData.userId];
      setIsheart(true);
    }
    // setHeartDataArray(heartArray);
    await addHeartMessage(heartArray, chatId, messageId);
  };

  const handleDoubleTap = () => {
    const now = new Date();
    const delay = 700;
    if (
      timePress.current &&
      now - timePress.current < delay
      // && !isAnimated.current
    ) {
      updateValueHeart();
      // isAnimated.current = true;
    } else {
      timePress.current = now;
    }
  };

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={handleDoubleTap}
        onLongPress={() => {
          menuRef.current.props.ctx.menuActions.openMenu(index);
        }}
      >
        <View
          style={[
            styles.contain,
            { alignSelf: type == "ownMessage" ? "flex-end" : "flex-start" },
          ]}
        >
          {avatar != "" && (
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("../assets/image/noAvatar.jpeg")
              }
              style={styles.avatar}
            />
          )}

          <View style={{ marginHorizontal: 15, maxWidth: "70%" }}>
            {sentByName && (
              <Text
                style={{
                  color: Colors.lightGrey,
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 5,
                }}
              >
                {sentByName}
              </Text>
            )}
            <View
              style={[
                styles.containMessage,
                {
                  backgroundColor:
                    type == "ownMessage"
                      ? Colors.message
                      : Colors.friendMessage,
                },
                imageMessage && { paddingVertical: 0, paddingRight: 0 },
              ]}
            >
              {replyMessageAbove && (
                <View
                  style={[
                    styles.containReplyMessage,
                    {
                      backgroundColor:
                        type == "friendMessage" ? "#1c2124" : "#054d2e",
                    },
                    imageMessage && { marginRight: 7, marginTop: 5 },
                  ]}
                >
                  <Text style={styles.nameReply}>
                    {replyMessageAbove.lastName}
                  </Text>
                  <Text numberOfLines={1} style={styles.contentReply}>
                    {replyMessageAbove.text}
                  </Text>
                </View>
              )}

              {imageMessage ? (
                <View style={styles.imageContainReplace}>
                  <Image source={{ uri: imageMessage }} style={styles.image} />
                </View>
              ) : (
                <Text style={styles.message}>{children}</Text>
              )}
              <Text style={styles.time}>{time}</Text>

              {/* Icon heart */}

              <View
                style={[
                  styles.heartContainer,
                  { opacity: heartDataArray.length > 0 ? 1 : 0 },
                ]}
              >
                <Animated.Image
                  style={[styles.heartIcon, heartAnimation]}
                  source={require("../assets/image/heart.png")}
                />
                {heartDataArray.length > 1 && (
                  <Text style={{ color: "white", marginLeft: 4, fontSize: 12 }}>
                    {heartDataArray.length}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Menu modal */}
      <Menu name={index} ref={menuRef} style={styles[type]}>
        <MenuTrigger />
        <MenuOptions>
          <MenuOption onSelect={() => onSelectReply()} text="Reply" />
          <MenuOption
            onSelect={async () => {
              await Clipboard.setStringAsync(children);
            }}
            text="Copy"
          />
          <MenuOption onSelect={() => alert(`Delete`)}>
            <Text style={{ color: "red" }}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  contain: {
    flexDirection: "row",
    marginVertical: 15,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    alignSelf: "flex-end",
  },

  //phải có backgroundColor mới boderRadius đc
  containMessage: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingRight: 10,
  },

  //image

  imageContainReplace: {
    maxWidth: 300,
    overflow: "hidden",
    borderColor: Colors.message,
    borderWidth: 4,
    borderRadius: 10,
  },

  image: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
  },

  //replymessage

  containReplyMessage: {
    opacity: 0.8,
    borderLeftColor: "#ff00d0",
    borderLeftWidth: 4,
    borderRadius: 7,
    paddingVertical: 7,
    paddingLeft: 8,
    marginLeft: 7,
    marginBottom: 10,
  },

  nameReply: {
    letterSpacing: 0.5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff00d0",
    marginBottom: 7,
  },
  contentReply: {
    maxWidth: "97%",
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#af93aa",
  },

  message: {
    // maxWidth: "80%",
    minWidth: 100,
    fontSize: 16,
    color: "white",
    letterSpacing: 0.5,
    lineHeight: 21,
    paddingLeft: 10,
    paddingBottom: 8,
  },

  //heartIcon
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: -24,
    right: 2,
    backgroundColor: "#2e3132",
    padding: 5,
    borderRadius: 10,
  },
  heartIcon: {
    width: 17,
    height: 17,
  },

  time: {
    position: "absolute",
    bottom: 1,
    right: 10,
    letterSpacing: 0.3,
    color: Colors.lightGrey,
    fontSize: 13,
  },
});

export default Message;

//            <Image
//               source={{ uri: imageMessage }}
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 // resizeMode: "contain",
//               }}
//             />
// imageMessage && {
//   backgroundColor: "transparent",
//   borderColor: Colors.message,
//   borderWidth: 4,
//   width: 300,
//   height: 300,
//   paddingVertical: 0,
//   paddingRight: 0,
// },
