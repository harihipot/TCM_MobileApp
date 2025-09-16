import { roundIcon } from "@/assets/images";
import { Button, Loader, TextInputComponent } from "@/src/components";
import { strings } from "@/src/constants";
import { persistor } from "@/src/store";
import { changePassword, logout } from "@/src/store/reducers/authSlice";
import { resetAuthToken } from "@/src/utils/storageUtils";
import React, { useEffect, useState } from "react";

import { Alert, Image, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePassword = (props: any) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState<
    string | null
  >(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const authState = useSelector((state: any) => state.auth);
  const { isLoading, user } = authState;

  // Refresh page when hamburger menu (drawer) is clicked and page is focused
  // Reset all fields and errors
  const resetFields = React.useCallback(() => {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setCurrentPasswordError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", resetFields);
    return unsubscribe;
  }, [props.navigation, resetFields]);

  const performLogout = async () => {
    resetAuthToken();
    dispatch(logout());
    await persistor.purge(); // Clear persisted redux state

    // Instantly reset navigation to login before clearing redux state
    props.navigation.reset({
      index: 0,
      routes: [{ name: "login" }],
    });
  };

  useEffect(() => {
    if (authState) {
      const { changePasswordResp } = authState;
      if (changePasswordResp)
        Alert.alert(
          strings.alert.success,
          strings.login.changePasswordSuccess,
          [
            {
              text: strings.alert.ok,
              onPress: performLogout,
            },
          ],
          { cancelable: false }
        );
    }
  }, [authState]);

  // Generic field validation
  const validatePassword = React.useCallback((value: string) => {
    if (value.length < 8) return strings.login.passwordMinLength;
    if (!passwordRegex.test(value)) return strings.login.passwordRegexError;
    return null;
  }, []);

  const currentPasswordChange = (text: string) => {
    setCurrentPassword(text);
    setCurrentPasswordError(
      text.length >= 8 ? null : strings.login.passwordMinLength
    );
  };

  const passwordChange = (text: string) => {
    setPassword(text);
    setPasswordError(validatePassword(text));
    // Also update confirm password error if confirmPassword is set
    if (confirmPassword) {
      setConfirmPasswordError(
        text === confirmPassword
          ? validatePassword(confirmPassword)
          : strings.login.passwordsDoNotMatch
      );
    }
  };

  const confirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError(
      text === password
        ? validatePassword(text)
        : strings.login.passwordsDoNotMatch
    );
  };

  const onChangePasswordClicked = () => {
    const currentError =
      currentPassword.length >= 8 ? null : strings.login.passwordMinLength;
    const passwordErr = validatePassword(password);
    const confirmErr =
      password === confirmPassword
        ? validatePassword(confirmPassword)
        : strings.login.passwordsDoNotMatch;
    setCurrentPasswordError(currentError);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmErr);
    if (currentError || passwordErr || confirmErr) return;
    dispatch(
      changePassword({
        userId: user.id,
        oldPassword: currentPassword,
        confirmPassword: confirmPassword,
      })
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>
      <Image
        style={styles.imageStyle}
        resizeMode="contain"
        source={roundIcon}
      />
      <TextInputComponent
        placeholderText={strings.login.currentPassword}
        textValue={currentPassword}
        onChange={currentPasswordChange}
        errorMessage={currentPasswordError}
      />
      <TextInputComponent
        placeholderText={strings.login.newPassword}
        textValue={password}
        onChange={passwordChange}
        errorMessage={passwordError}
      />
      <TextInputComponent
        placeholderText={strings.login.confirmNewPassword}
        textValue={confirmPassword}
        onChange={confirmPasswordChange}
        errorMessage={confirmPasswordError}
      />
      <Button
        label={strings.common.submit}
        onClick={onChangePasswordClicked}
        buttonStyle={styles.buttonStyle}
      />
      {isLoading && <Loader />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    marginTop: "20%",
  },
  imageStyle: {
    alignSelf: "center",
    width: 120,
    height: 120,
  },
  buttonStyle: {
    marginTop: 50,
  },
});

export default ChangePassword;
