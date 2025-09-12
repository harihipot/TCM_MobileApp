import { TextInputComponent } from "@/src/components/TextInputView";
import { strings } from "@/src/constants/AppStrings";
import React from "react";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { Button } from "@/src/components/Button";
import { TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

const ViewBills = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [transId, setTransId] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Example dynamic values (replace with real data as needed)
  const monthStart = new Date(2025, 8, 1); // September 1, 2025
  const monthEnd = new Date(2025, 8, 30); // September 30, 2025
  const monthName = monthStart.toLocaleString("default", { month: "long" });
  const presentDays = 20; // dynamic
  const absentDays = 5; // dynamic

  const changeTransId = (text: string) => setTransId(text);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    // Submit logic here
  };

  return (
    <View style={styles.containerStyle}>
      {/* 1. Greeting */}
      <Text style={styles.greeting}>{`${strings.bills.hi}, ${
        user?.firstName || ""
      } ${user?.lastName || ""}`}</Text>

      {/* 2. Date duration */}
      <Text style={styles.dateRange}>
        {`${monthName} ${monthStart.getDate()} - ${monthEnd.getDate()}, ${monthEnd.getFullYear()}`}
      </Text>

      {/* 3. Present days */}

      <Text
        style={styles.label}
      >{`${strings.bills.daysPresent}: ${presentDays}`}</Text>

      {/* 4. Absent days */}
      <Text
        style={styles.label}
      >{`${strings.bills.daysAbsent}: ${absentDays}`}</Text>

      {/* 5. Transaction ID input */}
      <TextInputComponent
        placeholderText={strings.bills.transactionId}
        textValue={transId}
        onChange={changeTransId}
        containerStyleProp={styles.input}
      />

      {/* 6. Transaction Image upload */}
      <Text style={styles.sectionLabel}>{strings.bills.transactionImage}</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
        <Text style={styles.uploadBtnText}>{strings.bills.uploadImage}</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* 7. Submit button */}
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
    color: "#555",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  uploadBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadBtnText: {
    color: "#fff",
    fontWeight: "bold",
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
});

export default ViewBills;
