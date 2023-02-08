import * as ImagePicker from "expo-image-picker";

import {
  requesCameraPermission,
  requesLibrabyPermission,
} from "./requestPermission";

export const openLibraryImage = async () => {
  const hasPermission = await requesLibrabyPermission();
  if (hasPermission) {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      aspect: [1, 1],
      quality: 0.2,
    });
    if (!result.canceled) {
      return result.assets[0].uri;
    }
  }
};

export const openCameraImage = async () => {
  const hasPermission = await requesCameraPermission();
  if (hasPermission) {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
    });
    if (!result.canceled) {
      return result.assets[0].uri;
    }
  }
};
