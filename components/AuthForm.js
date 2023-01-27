import { useNavigation } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

import { Colors } from "../constants/colors";
import CustomButtom from "./CustomButtom";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "At least 8 character").required("Required"),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(8, "At least 8 character").required("Required"),
});

function AuthForm({ isLogin }) {
  const navigation = useNavigation();

  const initialValues = isLogin
    ? { email: "", password: "" }
    : { firstName: "", lastName: "", email: "", password: "" };

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} bounces={false}>
        <View style={styles.wrapper}>
          <Image
            style={styles.image}
            source={require("../assets/image/logo.png")}
            resizeMode="contain"
          />
          <Formik
            validationSchema={isLogin ? LoginSchema : SignupSchema}
            initialValues={initialValues}
            onSubmit={(values, { resetForm }) => {
              console.log(values);
              resetForm({ values: initialValues });
            }}
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
                {!isLogin && (
                  <>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>First name</Text>
                      <TextInput
                        onChangeText={handleChange("firstName")}
                        onBlur={handleBlur("firstName")}
                        value={values.firstName}
                        style={styles.textInptut}
                      />
                      {errors.firstName && touched.firstName ? (
                        <Text style={styles.errorText}>{errors.firstName}</Text>
                      ) : null}
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Last name</Text>
                      <TextInput
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        value={values.lastName}
                        style={styles.textInptut}
                      />
                      {errors.lastName && touched.lastName ? (
                        <Text style={styles.errorText}>{errors.lastName}</Text>
                      ) : null}
                    </View>
                  </>
                )}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                    style={styles.textInptut}
                  />
                  {errors.email && touched.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    style={styles.textInptut}
                  />
                  {errors.password && touched.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  ) : null}
                </View>

                <CustomButtom onPress={handleSubmit}>
                  {isLogin ? "Login" : "Sign up"}
                </CustomButtom>
              </>
            )}
          </Formik>

          <CustomButtom
            onPress={switchAuthModeHandler}
            style={{ backgroundColor: "transparent" }}
            textStyle={{ color: Colors.blue, fontSize: 17 }}
          >
            {isLogin ? "Register Account" : "Have already account?"}
          </CustomButtom>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
  },

  image: {
    width: "50%",
    height: 150,
    marginVertical: 10,
    alignSelf: "center",
  },
  formGroup: {
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
  textInptut: {
    fontSize: 17,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "rgb(182, 182, 182)",
  },
  errorText: {
    color: "red",
    fontSize: 17,
    marginLeft: 7,
  },
});

export default AuthForm;
