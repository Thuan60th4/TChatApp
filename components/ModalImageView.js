import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";

import { Colors } from "../constants/colors";

const ImageViewer = ({ isModalVisible, imageUrl, closeModal }) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    if (imageUrl) {
      Image.getSize(
        imageUrl,
        (Width, Height) => {
          const aspectRatio = Width / Height;
          const width = windowDimensions.width * 0.9; // Chiều rộng của ảnh tối đa là 80% chiều rộng màn hình
          const height = width / aspectRatio;
          setSize({ width, height });
          setLoading(false);
        },
        (errorMsg) => {
          console.log(errorMsg);
        }
      );
    }
  }, [imageUrl]);
  return (
    <Modal
      isVisible={isModalVisible}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={[
        styles.conatain,
        { justifyContent: size.height > 750 ? "flex-end" : "center" },
      ]}
      onBackdropPress={closeModal}
      backdropOpacity={0.95}
      backdropColor={"rgb(116, 116, 116)"}
    >
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <TouchableOpacity
            onPress={closeModal}
            style={{
              position: "absolute",
              top: Platform.OS == "android" ? 0 : 40,
              alignSelf: "flex-start",
              zIndex: 10,
            }}
          >
            <AntDesign name="close" size={26} color={Colors.space} />
          </TouchableOpacity>
          <Image
            source={{ uri: imageUrl }}
            style={[
              styles.modalImage,
              { height: size.height, width: size.width },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  conatain: {
    // flex: 1,
    alignItems: "center",
  },
  modalImage: {
    maxHeight: "85%",
    borderRadius: 15,
  },
});

export default ImageViewer;
