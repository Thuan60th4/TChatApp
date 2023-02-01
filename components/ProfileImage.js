import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { Colors } from "../constants/colors";
import {
  requesCameraPermission,
  requesLibrabyPermission,
} from "../utils/requestPermission";
import { updateUserData, uploadImageToFirebase } from "../firebase";
import { useDispatch } from "react-redux";
import { updateDataState } from "../store/ActionSlice";

function ProfileImage({ userData }) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const openImagePicker = async () => {
    try {
      const hasPermission = await requesLibrabyPermission();
      if (hasPermission) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          allowsMultipleSelection: false,
          aspect: [1, 1],
        });

        if (!result.canceled) {
          setLoading(true);
          const urlImg = await uploadImageToFirebase(result.assets[0].uri);
          const avatar = { avatar: urlImg };
          await updateUserData(userData.userId, avatar);
          dispatch(updateDataState(avatar));
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openCamera = async () => {
    const hasPermission = await requesCameraPermission();
    if (hasPermission) {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        setLoading(true);
        const urlImg = await uploadImageToFirebase(result.assets[0].uri);
        const avatar = { avatar: urlImg };
        await updateUserData(userData.userId, avatar);
        dispatch(updateDataState(avatar));
        setLoading(false);
      }
    }
  };

  const handlePickImage = () => {
    showActionSheetWithOptions(
      {
        options: ["Take a picture", "Choose a picture", "Cancel"],
        cancelButtonIndex: 2,
        tintColor: Colors.blue,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          openCamera();
        } else if (buttonIndex === 1) {
          openImagePicker();
        }
      }
    );
  };
  return (
    <TouchableOpacity onPress={handlePickImage}>
      {loading ? (
        <View
          style={[
            styles.image,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <Image
          style={styles.image}
          source={
            userData.avatar
              ? { uri: userData.avatar }
              : require("../assets/image/noAvatar.jpeg")
          }
        />
      )}

      <View style={styles.containIcon}>
        <FontAwesome name="pencil" size={15} color="black" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    borderRadius: 50,
    borderColor: Colors.lightGrey,
    borderWidth: 2,
  },
  containIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.lightGrey,
    borderRadius: 20,
    padding: 8,
  },
});

export default ProfileImage;
