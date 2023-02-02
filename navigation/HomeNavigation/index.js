import { getAuth } from "firebase/auth";
import { get, getDatabase, off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../constants/colors";

import { app } from "../../firebase/initalFirebase";
import { setChatsData, setStoredUsers } from "../../store/ActionSlice";
import MainNavigation from "./MainNavigation";

const auth = getAuth();
const db = getDatabase();

function HomeNavigation() {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const userChatsRef = ref(db, `userChats/${userData.userId}`);

    const refs = [userChatsRef];

    onValue(userChatsRef, (snapshot) => {
      const chatIdsData = snapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData = {};
      let chatsFoundCount = 0;

      for (const chatId of chatIds) {
        const chatRef = ref(db, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
          const data = chatSnapshot.val();
          if (data) {
            //thêm vào để làm khóa cho chỗ flatlist cho dễ
            for (const userId of data.users) {
              if (userData.userId != userId) {
                get(ref(db, `users/${userId}`)).then((userSnapshot) => {
                  const userSnapshotData = userSnapshot.val();
                  dispatch(setStoredUsers(userSnapshotData));
                });
              }
            }
            data.key = chatSnapshot.key;
            chatsData[chatSnapshot.key] = data;
          }

          if (chatsFoundCount >= chatIds.length) {
            dispatch(setChatsData(chatsData));
            setIsLoading(false);
          }
        });
      }
      if (chatsFoundCount == 0) {
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
