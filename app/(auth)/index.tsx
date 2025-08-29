import { roundIcon } from "@/assets/images";
import { Button } from "@/components/Button";
import { TextInputComponent } from "@/components/TextInputView";
import { strings } from "@/constants/AppStrings";
import { loginUser } from "@/store/reducers/authSlice";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
const LoginScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("8072807617");
  const [password, setpassword] = useState("23e5387a6283c437");

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const usernameChange = (text: string) => {
    setUsername(text);
  };

  const passwordChange = (text: string) => {
    setpassword(text);
  };

  const loginClicked = () => {
    dispatch(loginUser({ username, password }));
    // router.replace("./(drawer)/home");
  };

  return (
    <SafeAreaView style={styles.containerStyle}>
      <Image
        style={styles.imageStyle}
        resizeMode="contain"
        source={roundIcon}
      />
      <TextInputComponent
        placeholderText={strings.login.username}
        textValue={username}
        onChange={usernameChange}
      />
      <TextInputComponent
        placeholderText={strings.login.password}
        textValue={password}
        onChange={passwordChange}
      />
      <Button
        label={strings.login.loginText}
        onClick={loginClicked}
        buttonStyle={styles.loginButtonStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    marginTop: "40%",
  },
  imageStyle: {
    alignSelf: "center",
    width: 180,
    height: 180,
  },
  loginButtonStyle: {
    marginTop: 50,
  },
});

export default LoginScreen;
