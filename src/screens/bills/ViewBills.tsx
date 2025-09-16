import { TextInputComponent, Button, IconTooltip } from "@/src/components";
import { strings, Colors } from "@/src/constants";
import React, { useState } from "react";

import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useSelector } from "react-redux";

import * as ImagePicker from "expo-image-picker";
import { roundIcon } from "@/assets/images";

const ViewBills = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [transId, setTransId] = useState("");
  const [transIdError, setTransIdError] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Example dynamic values (replace with real data as needed)
  const monthStart = new Date(2025, 8, 1); // September 1, 2025
  const monthEnd = new Date(2025, 8, 30); // September 30, 2025
  const monthName = monthStart.toLocaleString("default", { month: "long" });
  const presentDays = 20; // dynamic
  const absentDays = 5; // dynamic

  const changeTransId = React.useCallback((text: string) => {
    setTransId(text);
    if (text.trim()) setTransIdError("");
  }, []);

  const pickImage = React.useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 8],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setImageError(false);
    }
  }, []);

  const handleSubmit = React.useCallback(() => {
    const transIdValid = !!transId.trim();
    const imageValid = !!image;
    setTransIdError(transIdValid ? "" : strings.bills.transactionIdRequired);
    setImageError(!imageValid);
    if (!transIdValid || !imageValid) return;
    // Submit logic here
  }, [transId, image]);

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.greeting}>{`${strings.bills.hi}, ${
        user?.firstName || ""
      } ${user?.lastName || ""}`}</Text>

      <Text style={styles.dateRange}>
        {`${monthName} ${monthStart.getDate()} - ${monthEnd.getDate()}, ${monthEnd.getFullYear()}`}
      </Text>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>{strings.bills.daysPresent}</Text>
        <Text style={styles.value}>{presentDays} Days</Text>
      </View>

      <View style={styles.rowBetween}>
        <Text style={styles.label}>{strings.bills.daysAbsent}</Text>
        <Text style={styles.value}>{absentDays} Days</Text>
      </View>

      <View style={styles.rowBetween}>
        <View style={styles.rowIconLabel}>
          <Text style={styles.label}>{strings.bills.billAmount}</Text>
          <IconTooltip
            style={styles.iconMargin}
            iconName={"info"}
            tooltipContent={strings.bills.billAmountTooltip}
          />
        </View>
        <Text style={styles.value}>Rs {presentDays * 160}</Text>
      </View>

      <TextInputComponent
        label={`${strings.bills.transactionId} *`}
        textValue={transId}
        autoCapitalizeProp="characters"
        containerStyleProp={styles.input}
        onChange={changeTransId}
        errorMessage={transIdError}
        errorStyle={styles.inputError}
      />

      <Text
        style={styles.sectionLabel}
      >{`${strings.bills.transactionImage} *`}</Text>

      <Pressable style={styles.uploadBtn} onPress={pickImage}>
        <Image
          source={image ? { uri: image } : roundIcon}
          style={styles.imagePreview}
        />
        <Text style={[styles.uploadBtnText, imageError && styles.errorRed]}>
          {strings.bills.uploadImage}
        </Text>
      </Pressable>

      <Button
        label={strings.common.submit}
        onClick={handleSubmit}
        buttonStyle={styles.submitBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: "10%",
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 16,
    color: Colors.textColor,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: "bold",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textColor,
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    marginBottom: 16,
    marginTop: 0,
  },
  uploadBtn: {
    borderColor: Colors.primary,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadBtnText: {
    color: Colors.textColor,
    fontWeight: "bold",
  },
  errorRed: {
    color: Colors.errorRed,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  submitBtn: {
    marginTop: 20,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rowIconLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: {
    marginLeft: 8,
  },
  inputError: {
    marginLeft: 0,
    paddingTop: 0,
    marginTop: -12,
  },
  value: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: "bold",
    textAlign: "right",
    minWidth: 60,
  },
});

export default ViewBills;
