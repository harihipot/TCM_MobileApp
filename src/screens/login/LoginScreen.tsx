import Images from "@/assets/images";
import { Button, Loader, TextInputComponent } from "@/src/components";
import { strings, Colors } from "@/src/constants";
import {
  forgotPassword,
  loginUser,
  resetAuth,
} from "@/src/store/reducers/authSlice";
import { resetAuthToken, storeAuthToken } from "@/src/utils/storageUtils";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert, Image, SafeAreaView, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const LoginScreen = (props: any) => {
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const [mobileNumber, setMobileNumber] = useState("8072472967");
  const [password, setpassword] = useState("Hipotsh@07");
  const [mobileNumberError, setMobileNumberError] = useState<string | null>(
    null
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const authState = useSelector((state: any) => state.auth);
  const { isLoading, forgotPasswordResp } = authState;

  useEffect(() => {
    resetAuthToken();
  }, []);

  useEffect(() => {
    if (authState) {
      const { user } = authState;
      if (user && user.token && user.token !== "") {
        storeAuthToken(user.token);
        if (user.isFirstTimeLogin) {
          // Redirect to ChangePassword inside DrawerNavigator and prevent back navigation
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "drawer",
                state: {
                  routes: [{ name: strings.headers.changePassword }],
                },
              },
            ],
          });
        } else {
          props.navigation.replace("drawer");
        }
      }
    }
  }, [authState]);

  useEffect(() => {
    if (
      forgotPasswordResp &&
      forgotPasswordResp.toString().includes("successfully")
    ) {
      Alert.alert(
        strings.login.forgotPasswordText,
        strings.login.passwordResetSuccess,
        [{ text: "OK", onPress: () => dispatch(resetAuth()) }]
      );
    }
  }, [forgotPasswordResp]);

  // Load remembered credentials on mount
  useEffect(() => {
    (async () => {
      try {
        const storageUtils = require("@/src/utils/storageUtils");
        const savedMobile = await storageUtils._get("rememberedMobile");
        const savedPassword = await storageUtils._get("rememberedPassword");
        const savedRememberMe = await storageUtils._get("rememberMe");
        if (savedRememberMe === "true" && savedMobile && savedPassword) {
          setMobileNumber(savedMobile);
          setpassword(savedPassword);
          setRememberMe(true);
        }
      } catch (e) {}
    })();
  }, []);

  const usernameChange = (text: string) => {
    setMobileNumber(text);
    setMobileNumberError(null);
  };

  const passwordChange = (text: string) => {
    setpassword(text);
    setPasswordError(null);
  };

  const validateInputs = (): boolean => {
    let valid = true; // Assume inputs are valid initially

    // Validate mobile number
    if (mobileNumber.trim() === "") {
      setMobileNumberError(strings.login.mobileRequired);
      valid = false;
    } else if (mobileNumber.length < 10) {
      setMobileNumberError(strings.login.invalidMobile);
      valid = false;
    }
    // Validate password
    if (password.trim() === "") {
      setPasswordError(strings.login.passwordRequired);
      valid = false;
    }
    return valid;
  };

  const loginClicked = () => {
    if (validateInputs()) {
      if (rememberMe) {
        AsyncStorage.setItem("rememberedMobile", mobileNumber);
        AsyncStorage.setItem("rememberedPassword", password);
        AsyncStorage.setItem("rememberMe", "true");
      } else {
        AsyncStorage.removeItem("rememberedMobile");
        AsyncStorage.removeItem("rememberedPassword");
        AsyncStorage.setItem("rememberMe", "false");
      }
      dispatch(loginUser({ mobileNumber, password }));
    }
  };

  const forgotPasswordClicked = () => {
    if (mobileNumber.trim() === "" && mobileNumber.length < 10) {
      setMobileNumberError(strings.login.invalidMobile);
      return;
    }
    dispatch(forgotPassword({ mobileNumber }));
  };

  return (
    <SafeAreaView style={styles.containerStyle}>
      <Image
        style={styles.imageStyle}
        resizeMode="contain"
        source={Images.roundIcon}
      />
      <TextInputComponent
        placeholderText={strings.login.mobile}
        textValue={mobileNumber}
        onChange={usernameChange}
        containerStyleProp={styles.containerStyleProp}
        errorMessage={mobileNumberError}
      />
      <TextInputComponent
        placeholderText={strings.login.password}
        textValue={password}
        onChange={passwordChange}
        containerStyleProp={styles.containerStyleProp}
        errorMessage={passwordError}
      />
      <Text style={styles.forgotTextStyle} onPress={forgotPasswordClicked}>
        {strings.login.forgotPassword}
      </Text>
      {/* <Text
        style={styles.rememberMeContainer}
        onPress={() => setRememberMe(!rememberMe)}
      >
        <Text style={styles.checkbox}>
          {rememberMe
            ? strings.login.checkboxChecked
            : strings.login.checkboxUnchecked}
        </Text>
        {` ${strings.login.rememberMe}`}
      </Text> */}
      <Button
        label={strings.login.loginText}
        onClick={loginClicked}
        buttonStyle={styles.loginButtonStyle}
      />
      {isLoading && <Loader />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.textColor,
  },
  checkbox: {
    fontSize: 18,
    marginRight: 8,
    color: Colors.textColor,
  },
  containerStyle: {
    flex: 1,
    alignItems: "center",
  },
  imageStyle: {
    alignSelf: "center",
    width: 160,
    height: 160,
    marginTop: "30%",
  },
  loginButtonStyle: {
    marginTop: 50,
  },
  forgotTextStyle: {
    marginTop: 20,
    marginRight: "11%",
    color: Colors.textColor,
    fontSize: 16,
    alignSelf: "flex-end",
    textDecorationLine: "underline",
  },
  containerStyleProp: {
    marginTop: 25,
  },
});

export default LoginScreen;
