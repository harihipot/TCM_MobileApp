import { roundIcon } from "@/assets/images";
import { Button } from "@/components/Button";
import { TextInputComponent } from "@/components/TextInputView";
import { strings } from "@/constants/AppStrings";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet } from "react-native";
const LoginScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");

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
    router.replace("./(drawer)/home");
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
