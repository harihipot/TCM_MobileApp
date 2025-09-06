import { roundIcon } from "@/assets/images";
import { Colors } from "@/src/constants/Colors";
import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type TextInputViewProps = {
  containerStyleProp?: any;
  placeholderText?: any;
  inputTextStyle?: any;
  textValue: any;
  onChange?: any;
  keyboardTypeProp?: any;
  errorMessage?: any;
  maxLengthProp?: number;
  autoCapitalizeProp?:
    | "none"
    | "sentences"
    | "words"
    | "characters"
    | undefined;
  isEditable?: boolean;
  image?: any;
  imageOnClick?: () => void;
};

export const TextInputComponent = (props: TextInputViewProps) => {
  const {
    placeholderText,
    inputTextStyle,
    textValue,
    onChange,
    keyboardTypeProp,
    errorMessage,
    maxLengthProp,
    autoCapitalizeProp = "none",
    isEditable,
    image,
    containerStyleProp,
    imageOnClick,
  } = props;
  return (
    <>
      <View style={[styles.containerStyle, containerStyleProp]}>
        <View style={styles.textImageContainerStyle}>
          <TextInput
            editable={isEditable}
            placeholder={placeholderText}
            placeholderTextColor={Colors.textColor}
            keyboardType={keyboardTypeProp}
            maxLength={maxLengthProp}
            secureTextEntry={
              placeholderText === "Password" ||
              placeholderText === "Current Password" ||
              placeholderText === "New Password" ||
              placeholderText === "Confirm New Password"
            }
            style={[styles.inputStyle, inputTextStyle]}
            value={textValue}
            onChangeText={(text) => {
              onChange(text);
            }}
            autoCapitalize={autoCapitalizeProp}
          />
          {image && (
            <Pressable
              onPress={imageOnClick}
              style={styles.imageContainerStyle}
            >
              <Image
                source={image ? image : roundIcon}
                style={styles.imageStyle}
                resizeMode="contain"
              />
            </Pressable>
          )}
        </View>
      </View>
      {errorMessage && errorMessage !== "" && (
        <Text style={styles.errorStyle}>{errorMessage}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    width: "80%",
    borderColor: Colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
  },
  inputStyle: {
    flex: 1,
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: "500",
    padding: 12,
  },
  errorStyle: {
    fontSize: 12,
    color: Colors.errorRed,
    paddingTop: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginLeft: 36,
  },
  imageContainerStyle: {
    width: 30,
    height: "auto",
    marginRight: 10,
    alignItems: "center",
  },
  imageStyle: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  textImageContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
