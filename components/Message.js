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
  children,
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
            styles[type],
            (isHeart || heartDataArray.length > 0) && { marginBottom: 20 },
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
              ]}
            >
              <Text style={styles.nameReply}>{replyMessageAbove.lastName}</Text>
              <Text numberOfLines={1} style={styles.contentReply}>
                {replyMessageAbove.text}
              </Text>
            </View>
          )}
          <Text style={styles.message}>{children}</Text>
          <Text style={styles.time}>{time}</Text>
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
      </TouchableWithoutFeedback>
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
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    maxWidth: "70%",
    paddingVertical: 10,
    paddingRight: 10,
  },

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

  //phải có backgroundColor mới boderRadius đc
  ownMessage: {
    backgroundColor: Colors.message,
    alignSelf: "flex-end",
  },
  friendMessage: {
    backgroundColor: Colors.friendMessage,
    alignSelf: "flex-start",
  },
  message: {
    // maxWidth: "80%",
    minWidth: 100,
    fontSize: 16,
    color: "white",
    letterSpacing: 0.5,
    lineHeight: 21,
    paddingLeft: 10,
    paddingBottom: 6,
  },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: -16,
    right: -9,
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
    bottom: 2,
    right: 16,
    letterSpacing: 0.3,
    color: Colors.grey,
    fontSize: 13,
  },
});

export default Message;
