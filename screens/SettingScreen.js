import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Formik } from "formik";
import { createRef, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { Colors } from "../constants/colors";
import CustomInput from "../components/CustomInput";
import { InfoUserSchema } from "../components/AuthForm/schemaValidate";
import CustomButtom from "../components/CustomButtom";
import { logOut, updateUserData } from "../firebase/auth";
import { authenticate } from "../store/AuthSlice";

function AuthForm() {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const textInputRefs = Array(3)
    .fill()
    .map(() => useRef(null));
  const initialValues = {
    firstName: userData ? userData.firstName : "",
    lastName: userData ? userData.lastName : "",
    email: userData ? userData.email : "",
    about: "",
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    textInputRefs.forEach((ref) => ref.current.blur());
    // console.log(textInputRefs);
    setLoading(true);
    await updateUserData(userData.userId, values);
    setLoading(false);
    // resetForm({ values: initialValues });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <Formik
          initialValues={initialValues}
          validationSchema={InfoUserSchema}
          onSubmit={handleSubmitForm}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.formGroup}>
                <CustomInput
                  ref={textInputRefs[0]}
                  label="First name"
                  Icon={AntDesign}
                  name="user"
                  styleTextInput={{ borderRadius: 0 }}
                  onChangeText={handleChange("firstName")}
                  onBlur={handleBlur("firstName")}
                  value={values.firstName}
                />
                {errors.firstName && touched.firstName ? (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                ) : null}
              </View>

              <View style={styles.formGroup}>
                <CustomInput
                  ref={textInputRefs[1]}
                  label="Last name"
                  Icon={AntDesign}
                  name="user"
                  styleTextInput={{ borderRadius: 0 }}
                  onChangeText={handleChange("lastName")}
                  onBlur={handleBlur("lastName")}
                  value={values.lastName}
                />

                {errors.lastName && touched.lastName ? (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                ) : null}
              </View>
              <View style={styles.formGroup}>
                <CustomInput
                  label="Email"
                  Icon={Feather}
                  name="mail"
                  styleTextInput={{ borderRadius: 0 }}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  editable={false}
                />

                {errors.email && touched.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              <View style={styles.formGroup}>
                <CustomInput
                  ref={textInputRefs[2]}
                  label="About"
                  Icon={AntDesign}
                  name="user"
                  styleTextInput={{
                    borderRadius: 0,
                  }}
                  onChangeText={handleChange("about")}
                  onBlur={handleBlur("about")}
                  value={values.about}
                  multiline={true}
                />

                {errors.about && touched.about ? (
                  <Text style={styles.errorText}>{errors.about}</Text>
                ) : null}
              </View>
              {loading ? (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{ marginTop: 30 }}
                />
              ) : (
                <CustomButtom
                  style={{ marginTop: 20, borderRadius: 5 }}
                  onPress={handleSubmit}
                >
                  Save
                </CustomButtom>
              )}

              <CustomButtom
                style={{
                  marginTop: 20,
                  borderRadius: 5,
                  backgroundColor: "red",
                }}
                onPress={() => {
                  dispatch(authenticate({ token: null, userData: {} }));
                  logOut();
                }}
              >
                Log out
              </CustomButtom>
            </>
          )}
        </Formik>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: "black",
  },

  formGroup: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 17,
    marginLeft: 7,
  },
});

export default AuthForm;
