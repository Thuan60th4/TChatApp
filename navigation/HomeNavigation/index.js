import { StackActions, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { getAuth } from "firebase/auth";
import { get, getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "../../constants/colors";
import { storePushToken } from "../../firebase";
import { app } from "../../firebase/initalFirebase";
import {
  setChatMessages,
  setChatsData,
  setPushToken,
  setStoredUsers,
  updateDataState,
} from "../../store/ActionSlice";
import registerForPushNotificationsAsync from "../../utils/getExpoPushToken";
import MainNavigation from "./MainNavigation";

const auth = getAuth();
const db = getDatabase();

function HomeNavigation() {
  const { userData, storedUsers } = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    const getToken = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        // console.log(token);
        await storePushToken(userData, token);
        dispatch(setPushToken(token));
      }
    };
    getToken();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle received notification
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const chatId = response.notification.request.content.data.chatId;
        console.log(chatId);

        const pushAction = StackActions.replace("home");
        navigation.dispatch(pushAction);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const userChatsRef = ref(db, `userChats/${userData.userId}`);

    const refs = [userChatsRef];

    onValue(userChatsRef, (snapshot) => {
      const chatIdsData = snapshot.val() || {};
      const chatIds = Object.values(chatIdsData);
      // if (chatIds.length == 0) {
      //   dispatch(setChatsData());
      //   setIsLoading(false);
      // }
      const chatsData = {};
      let chatsFoundCount = 0;

      for (const chatId of chatIds) {
        const chatRef = ref(db, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
          const data = chatSnapshot.val();
          if (data) {
            //nếu bị xóa rồi thì off đi và retủn để cho nó ko lữu cái này vô chatsData
            if (data.newUsers && !data.newUsers.includes(userData.userId)) {
              off(ref(db, `chats/${chatId}`));
              return;
            }

            data.users.forEach((userId) => {
              if (storedUsers?.[userId]) return;
              get(ref(db, `users/${userId}`)).then((userSnapshot) => {
                const userSnapshotData = userSnapshot.val();
                dispatch(setStoredUsers(userSnapshotData));
              });
            });

            //thêm vào để làm khóa cho chỗ flatlist cho dễ
            data.key = chatSnapshot.key;
            // chatsData = { ...chatsData, [chatSnapshot.key]: data };
            chatsData[chatSnapshot.key] = data;
          }
          if (chatsFoundCount >= chatIds.length) {
            //định chuyền cả data sang cho bên redux xử lí nhưng vậy lại phải render theo số lần lặp
            dispatch(setChatsData(chatsData));
            setIsLoading(false);
          }
        });
        const messagesRef = ref(db, `messages/${chatId}`);
        refs.push(messagesRef);
        onValue(messagesRef, (messagesSnapshot) => {
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({ chatId, messagesData }));
        });
      }
      //cho vô trong sao nó lặp được vì lúc đầu nó ko có trò chuyện nào
      if (chatsFoundCount == 0) {
        dispatch(setChatsData());
        setIsLoading(false);
      }
    });

    const userRef = ref(db, `users/${userData.userId}`);
    refs.push(userRef);

    onValue(userRef, (snapshot) => {
      dispatch(updateDataState(snapshot.val()));
    });

    return () => {
      console.log("Unsubscribing firebase listeners");
      refs.forEach((ref) => off(ref));
    };
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    );
  }
  return <MainNavigation />;
}

export default HomeNavigation;
