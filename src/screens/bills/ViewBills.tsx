import { TextInputComponent } from "@/src/components/TextInputView";
import { strings } from "@/src/constants/AppStrings";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const ViewBills = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [transId, setTransId] = useState("");

  const changeTransId = () => {};

  return (
    <View style={styles.containerStyle}>
      <Text>Hi {user.firstName + " " + user.lastName} </Text>
      <Text>Transaction ID</Text>
      <TextInputComponent
        placeholderText={strings.login.username}
        textValue={transId}
        onChange={changeTransId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: "20%",
    paddingHorizontal: 10,
  },
});

export default ViewBills;
