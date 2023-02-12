import { getAuth } from "firebase/auth";
import { get, getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../constants/colors";

import { app } from "../../firebase/initalFirebase";
import {
  setChatMessages,
  setChatsData,
  setStoredUsers,
} from "../../store/ActionSlice";
import MainNavigation from "./MainNavigation";

const auth = getAuth();
const db = getDatabase();

function HomeNavigation() {
  const { userData, storedUsers } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

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
