import { roundIcon } from "@/assets/images";
import { Button } from "@/src/components/Button";
import { Loader } from "@/src/components/Loader";
import { TextInputComponent } from "@/src/components/TextInputView";
import { strings } from "@/src/constants/AppStrings";
import { persistor } from "@/src/store";
import { logout } from "@/src/store/reducers/authSlice";
import { resetAuthToken } from "@/src/utils/storageUtils";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePassword = (props: any) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const response = useSelector((state: any) => state.auth);
  const { isLoading } = response;

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
    if (response) {
      const { changePasswordResp } = response;
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
  }, [response]);

  const currentPasswordChange = (text: string) => {
    setCurrentPassword(text);
  };

  const confirmPasswordChange = (text: string) => {
    if (text.length > 0 && password !== text) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
    setConfirmPassword(text);
  };

  const passwordChange = (text: string) => {
    const isValid = passwordRegex.test(password);
    if (text.length > 0 && !isValid) {
      setPasswordError("Password does not meet the criteria");
    } else {
      setPasswordError(null);
    }
    setpassword(text);
  };

  const onChangePasswordClicked = () => {
    if (password === confirmPassword) {
      // dispatch(changePassword({ password }));
    }
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
