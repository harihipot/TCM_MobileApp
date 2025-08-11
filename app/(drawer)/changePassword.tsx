import { roundIcon } from "@/assets/images";
import { Button } from "@/components/Button";
import { TextInputComponent } from "@/components/TextInputView";
import { strings } from "@/constants/AppStrings";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

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
      // Logic to change the password
      console.log("Password changed successfully");
    } else {
      console.log("Passwords do not match");
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
        label={strings.login.changeText}
        onClick={onChangePasswordClicked}
        buttonStyle={styles.buttonStyle}
      />
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
