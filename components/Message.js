import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { Colors } from "../constants/colors";

function Message({ type, index, children }) {
  const [isHeart, setIsheart] = useState(false);
  const menuRef = useRef();
  const timePress = useRef();
  const heartValue = useRef(new Animated.Value(0)).current;
  const isAnimated = useRef(false);

  useEffect(() => {
    if (isHeart) {
      Animated.timing(heartValue, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        // useNativeDriver: true, native drive là đẩy mấy cái luồng animation
        //  sang luồng native gốc để tối ưu hiệu năng nhưng nó chỉ hỗ trợ mấy cái mà ko bị thay đổi layout (transform,opacity,border,...)
      }).start(() => (isAnimated.current = false));
    } else {
      heartValue.setValue(0);
      isAnimated.current = false;
    }
  }, [isHeart, heartValue]);

  const handleDoubleTap = () => {
    const now = new Date();
    const delay = 700;
    if (
      timePress.current &&
      now - timePress.current < delay &&
      !isAnimated.current
    ) {
      setIsheart(!isHeart);
      isAnimated.current = true;
    } else {
      timePress.current = now;
    }
  };

  const heartAnimation = {
    transform: [
      {
        scale: heartValue.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, 2, 2, 1],
        }),
      },
      {
        translateY: heartValue.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, -40, -40, 1],
        }),
      },
    ],
  };
  return (
    <View>
      <TouchableWithoutFeedback
        onPress={handleDoubleTap}
        onLongPress={() => {
          menuRef.current.props.ctx.menuActions.openMenu(index);
        }}
      >
        <Animated.View
          style={[
            styles.contain,
            styles[type],
            isHeart && { marginBottom: 20 },
          ]}
        >
          <Text style={styles.message}>{children}</Text>
          <Animated.View
            style={[styles.heartContainer, { opacity: isHeart ? 1 : 0 }]}
          >
            <Animated.Image
              style={[styles.heartIcon, heartAnimation]}
              source={require("../assets/image/heart.png")}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Menu name={index} ref={menuRef}>
        <MenuTrigger />
        <MenuOptions>
          <MenuOption onSelect={() => alert(`Reply`)} text="Reply" />
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
    margin: 10,
    borderRadius: 10,
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
    maxWidth: "80%",
    color: "white",
    letterSpacing: 0.5,
    lineHeight: 21,
    padding: 10,
    fontSize: 16,
  },
  heartContainer: {
    position: "absolute",
    bottom: -20,
    right: 5,
    backgroundColor: "#2e3132",
    padding: 5,
    borderRadius: 10,
  },
  heartIcon: {
    width: 18,
    height: 18,
  },
});

export default Message;
