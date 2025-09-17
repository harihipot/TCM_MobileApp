import React, { useEffect, useState, useMemo, useCallback } from "react";
import { roundIcon } from "@/assets/images";
import { Button, Loader, TextInputComponent } from "@/src/components";
import { strings } from "@/src/constants";
import { persistor } from "@/src/store";
import { changePassword, logout } from "@/src/store/reducers/authSlice";
import { resetAuthToken } from "@/src/utils/storageUtils";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePassword = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: null as string | null,
    password: null as string | null,
    confirmPassword: null as string | null,
  });
  const { isLoading, user, changePasswordResp } = useSelector(
    (state: any) => state.auth
  );

  // Refresh page when hamburger menu (drawer) is clicked and page is focused
  // Reset all fields and errors
  const resetFields = useCallback(() => {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setErrors({ currentPassword: null, password: null, confirmPassword: null });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", resetFields);
    return unsubscribe;
  }, [navigation, resetFields]);

  // Prevent back navigation if isFirstTimeLogin
  useEffect(() => {
    const backHandler = () => user?.isFirstTimeLogin || false;
    const subscription = require("react-native").BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );
    return () => subscription.remove();
  }, [user?.isFirstTimeLogin]);

  const performLogout = useCallback(async () => {
    resetAuthToken();
    dispatch(logout());
    await persistor.purge();
    navigation.reset({ index: 0, routes: [{ name: "login" }] });
  }, [dispatch, navigation]);

  useEffect(() => {
    if (changePasswordResp) {
      Alert.alert(
        strings.alert.success,
        strings.login.changePasswordSuccess,
        [{ text: strings.alert.ok, onPress: performLogout }],
        { cancelable: false }
      );
    }
  }, [changePasswordResp, performLogout]);

  // Generic field validation
  const validatePassword = useCallback((value: string) => {
    if (value.length < 8) return strings.login.passwordMinLength;
    if (!passwordRegex.test(value)) return strings.login.passwordRegexError;
    return null;
  }, []);

  const currentPasswordChange = useCallback((text: string) => {
    setCurrentPassword(text);
    setErrors((e) => ({
      ...e,
      currentPassword:
        text.length >= 8 ? null : strings.login.passwordMinLength,
    }));
  }, []);

  const passwordChange = useCallback(
    (text: string) => {
      setPassword(text);
      setErrors((e) => ({
        ...e,
        password: validatePassword(text),
        confirmPassword: confirmPassword
          ? text === confirmPassword
            ? validatePassword(confirmPassword)
            : strings.login.passwordsDoNotMatch
          : e.confirmPassword,
      }));
    },
    [confirmPassword, validatePassword]
  );

  const confirmPasswordChange = useCallback(
    (text: string) => {
      setConfirmPassword(text);
      setErrors((e) => ({
        ...e,
        confirmPassword:
          text === password
            ? validatePassword(text)
            : strings.login.passwordsDoNotMatch,
      }));
    },
    [password, validatePassword]
  );

  const onChangePasswordClicked = useCallback(() => {
    const currentError =
      currentPassword.length >= 8 ? null : strings.login.passwordMinLength;
    const passwordErr = validatePassword(password);
    const confirmErr =
      password === confirmPassword
        ? validatePassword(confirmPassword)
        : strings.login.passwordsDoNotMatch;
    setErrors({
      currentPassword: currentError,
      password: passwordErr,
      confirmPassword: confirmErr,
    });
    if (currentError || passwordErr || confirmErr) return;
    dispatch(
      changePassword({
        userId: user.id,
        oldPassword: currentPassword,
        confirmPassword: confirmPassword,
      })
    );
  }, [
    currentPassword,
    password,
    confirmPassword,
    user?.id,
    dispatch,
    validatePassword,
  ]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        containerStyle: {
          flex: 1,
          alignItems: "center",
          paddingTop: "20%",
        },
        imageStyle: {
          alignSelf: "center",
          width: 120,
          height: 120,
        },
        buttonStyle: {
          marginTop: 50,
        },
        infoTextStyle: {
          color: "#d9534f",
          fontWeight: "bold",
          fontSize: 16,
          marginBottom: 20,
          textAlign: "center",
        },
      }),
    []
  );

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.containerStyle}>
      {user?.isFirstTimeLogin && (
        <Text style={styles.infoTextStyle}>
          {strings.login.firstTimeChangePasswordMsg}
        </Text>
      )}
      <Image
        style={styles.imageStyle}
        resizeMode="contain"
        source={roundIcon}
      />
      <TextInputComponent
        placeholderText={strings.login.currentPassword}
        textValue={currentPassword}
        onChange={currentPasswordChange}
        errorMessage={errors.currentPassword}
      />
      <TextInputComponent
        placeholderText={strings.login.newPassword}
        textValue={password}
        onChange={passwordChange}
        errorMessage={errors.password}
      />
      <TextInputComponent
        placeholderText={strings.login.confirmNewPassword}
        textValue={confirmPassword}
        onChange={confirmPasswordChange}
        errorMessage={errors.confirmPassword}
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

export default ChangePassword;
