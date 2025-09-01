import { roundIcon } from "@/assets/images";
import { Button } from "@/src/components/Button";
import { Loader } from "@/src/components/Loader";
import { TextInputComponent } from "@/src/components/TextInputView";
import { strings } from "@/src/constants/AppStrings";
import { Colors } from "@/src/constants/Colors";
import { forgotPassword, loginUser } from "@/src/store/reducers/authSlice";
import { resetAuthToken, storeAuthToken } from "@/src/utils/storageUtils";
import { useEffect, useState } from "react";
import { Image, SafeAreaView, StyleSheet, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
const LoginScreen = (props: any) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("8072472967");
  const [password, setpassword] = useState("b326622c4d8eb221");
  const loginResponse = useSelector((state: any) => state.auth);
  const { isLoading } = loginResponse;

  useEffect(() => {
    resetAuthToken();
  }, []);

  useEffect(() => {
    if (loginResponse) {
      const { user } = loginResponse;
      if (user && user.token && user.token !== "") {
        storeAuthToken(user.token);
        props.navigation.navigate("drawer");
      }
    }
  }, [loginResponse]);

  const usernameChange = (text: string) => {
    setUsername(text);
  };

  const passwordChange = (text: string) => {
    setpassword(text);
  };

  const loginClicked = () => {
    dispatch(loginUser({ username, password }));
  };

  const forgotPasswordClicked = () => {
    dispatch(forgotPassword({ username }));
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
        containerStyleProp={styles.containerStyleProp}
      />
      <TextInputComponent
        placeholderText={strings.login.password}
        textValue={password}
        onChange={passwordChange}
        containerStyleProp={styles.containerStyleProp}
      />
      <Text style={styles.forgotTextStyle} onPress={forgotPasswordClicked}>
        {strings.login.forgotPassword}
      </Text>
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
  containerStyle: {
    flex: 1,
    alignItems: "center",
  },
  imageStyle: {
    alignSelf: "center",
    width: 180,
    height: 180,
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
  containerStyleProp:{
    marginTop:25
  }
});

export default LoginScreen;
