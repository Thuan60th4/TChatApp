import { forwardRef } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const CustomInput = forwardRef(
  ({ label, Icon, name, styleTextInput, ...textInputProps }, ref) => {
    return (
      <View >
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.textInputContain, styleTextInput]}>
          <Icon name={name} size={25} color="white" style={{ marginLeft: 6 }} />
          <TextInput
            ref={ref}
            {...textInputProps}
            style={[
              styles.textInptut,
              textInputProps.multiline && {
                textAlignVertical: "top",
                minHeight: 70,
              },
            ]}
          />
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  label: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 5,
    color: "white",
  },
  textInputContain: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(182, 182, 182)",
    borderRadius: 10,
  },
  textInptut: {
    flex: 1,
    fontSize: 17,
    paddingHorizontal: 10,
    paddingVertical: 11,
  },
});

export default CustomInput;
