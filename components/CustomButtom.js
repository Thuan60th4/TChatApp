import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/colors";

function CustomButtom({ children, style, onPress, textStyle }) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
});

export default CustomButtom;
