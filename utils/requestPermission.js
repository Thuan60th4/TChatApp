import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

export const requesLibrabyPermission = async () => {
  const status = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (status.status === ImagePicker.PermissionStatus.UNDETERMINED) {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return result.granted;
  }
  if (status.status === ImagePicker.PermissionStatus.DENIED) {
    if (status.canAskAgain) {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return result.granted;
    }
    Alert.alert(
      "insufficient permission",
      "You need to grant the library permission to use this app",
      [
        {
          text: "Go to Settings",
          onPress: async () => await Linking.openSettings(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
    return false;
  }
  return true;
};

export const requesCameraPermission = async () => {
  const status = await ImagePicker.getCameraPermissionsAsync();
  if (status.status === ImagePicker.PermissionStatus.UNDETERMINED) {
    const result = await ImagePicker.requestCameraPermissionsAsync();
    return result.granted;
  }
  if (status.status === ImagePicker.PermissionStatus.DENIED) {
    if (status.canAskAgain) {
      const result = await ImagePicker.requestCameraPermissionsAsync();
      return result.granted;
    }
    Alert.alert(
      "insufficient permission",
      "You need to grant the camera permission to use this app",
      [
        {
          text: "Go to Settings",
          onPress: async () => await Linking.openSettings(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
    return false;
  }
  return true;
};
