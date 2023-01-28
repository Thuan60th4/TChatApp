import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
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
    } else {
      res = await signUp(
        values.firstName,
        values.lastName,
        values.email,
        values.password
      );
      if (res.token) dispatch(authenticate(res));
    }
    setLoading(false);
    if (res.error) {
      Alert.alert("An Error Occured", res.error);
    }

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
                      <Text style={styles.label}>First name</Text>
                      <View style={styles.textInputContain}>
                        <AntDesign
                          name="user"
                          size={25}
                          color="white"
                          style={{ marginLeft: 6 }}
                        />
                        <TextInput
                          onChangeText={handleChange("firstName")}
                          onBlur={handleBlur("firstName")}
                          value={values.firstName}
                          style={styles.textInptut}
                        />
                      </View>
                      {errors.firstName && touched.firstName ? (
                        <Text style={styles.errorText}>{errors.firstName}</Text>
                      ) : null}
                    </View>

                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Last name</Text>
                      <View style={styles.textInputContain}>
                        <AntDesign
                          name="user"
                          size={25}
                          color="white"
                          style={{ marginLeft: 6 }}
                        />
                        <TextInput
                          onChangeText={handleChange("lastName")}
                          onBlur={handleBlur("lastName")}
                          value={values.lastName}
                          style={styles.textInptut}
                        />
                      </View>
                      {errors.lastName && touched.lastName ? (
                        <Text style={styles.errorText}>{errors.lastName}</Text>
                      ) : null}
                    </View>
                  </>
                )}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.textInputContain}>
                    <Feather
                      name="mail"
                      size={25}
                      color="white"
                      style={{ marginLeft: 6 }}
                    />
                    <TextInput
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      style={styles.textInptut}
                    />
                  </View>
                  {errors.email && touched.email ? (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  ) : null}
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.textInputContain}>
                    <Feather
                      name="lock"
                      size={25}
                      color="white"
                      style={{ marginLeft: 6 }}
                    />
                    <TextInput
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      style={styles.textInptut}
                      secureTextEntry={true}
                    />
                  </View>
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
  errorText: {
    color: "red",
    fontSize: 17,
    marginLeft: 7,
  },
});

export default AuthForm;
