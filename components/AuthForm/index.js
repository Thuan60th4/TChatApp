import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Formik } from "formik";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { Colors } from "../../constants/colors";
import CustomButtom from "../CustomButtom";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { signIn, signUp } from "../../firebase/auth";
import { LoginSchema, SignupSchema } from "./schemaValidate";
import { useDispatch } from "react-redux";
import { authenticate } from "../../store/AuthSlice";
import CustomInput from "../CustomInput";

function AuthForm({ isLogin }) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const initialValues = isLogin
    ? { email: "", password: "" }
    : { firstName: "", lastName: "", email: "", password: "" };

  const switchAuthModeHandler = () => {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    setLoading(true);
    let res;
    if (isLogin) {
      res = await signIn(values.email, values.password);
      // setTimeout(() => {
      //   dispatch(authenticate({ token: null, userData: null }));
      //   logOut();
      // }, 2000);
    } else {
      res = await signUp(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
    }
    if (res?.token) dispatch(authenticate(res));
    else if (res?.error) {
      Alert.alert("An Error Occured", res.error.replace("auth/", ""));
    }
    setLoading(false);

    // resetForm({ values: initialValues });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAwareScrollView style={{ flex: 1 }} bounces={false}>
        <View style={styles.wrapper}>
          <Image
            style={styles.image}
            source={require("../../assets/image/logo.png")}
            resizeMode="contain"
          />
          <Formik
            validationSchema={isLogin ? LoginSchema : SignupSchema}
            initialValues={initialValues}
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
                {!isLogin && (
                  <>
                    <View style={styles.formGroup}>
                      <CustomInput
                        label="First name"
                        Icon={AntDesign}
                        name="user"
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
                        label="Last name"
                        Icon={AntDesign}
                        name="user"
                        onChangeText={handleChange("lastName")}
                        onBlur={handleBlur("lastName")}
                        value={values.lastName}
                      />

                      {errors.lastName && touched.lastName ? (
                        <Text style={styles.errorText}>{errors.lastName}</Text>
                      ) : null}
                    </View>
                  </>
                )}
                <View style={styles.formGroup}>
                  <CustomInput
                    label="Email"
                    Icon={Feather}
                    name="mail"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    value={values.email}
                  />

                  {errors.email && touched.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                <View style={styles.formGroup}>
                  <CustomInput
                    label="Password"
                    Icon={Feather}
                    name="lock"
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    secureTextEntry={true}
                  />

                  {errors.password && touched.password ? (
                    <Text style={styles.errorText}>{errors.password}</Text>
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
                    style={{ marginTop: 20 }}
                    onPress={handleSubmit}
                  >
                    {isLogin ? "Login" : "Sign up"}
                  </CustomButtom>
                )}
              </>
            )}
          </Formik>

          <CustomButtom
            onPress={switchAuthModeHandler}
            style={{ backgroundColor: "transparent" }}
            textStyle={{ color: Colors.blue, fontSize: 17, marginTop: 17 }}
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
  errorText: {
    color: "red",
    fontSize: 17,
    marginLeft: 7,
  },
});

export default AuthForm;
