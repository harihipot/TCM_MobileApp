import {
  Button,
  EmptyView,
  IconTooltip,
  Loader,
  TextInputComponent,
} from "@/src/components";
import { strings, Colors } from "@/src/constants";
import React, { useEffect, useState } from "react";

import { Pressable, StyleSheet, Text, View, Image, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import * as ImagePicker from "expo-image-picker";
import Images from "@/assets/images";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { getbillsForUser } from "@/src/store/reducers/billSlice";
import moment from "moment";
import {
  hasRequiredFields,
  parseUPIScreenshotText,
} from "@/src/utils/commonUtils";
import { ScrollView } from "react-native-gesture-handler";

const ViewBills = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.auth.user);
  const isLoader = useSelector((state: any) => state.bill.isLoading);

  const billForLastMonth = useSelector((state: any) => state.bill.getBillResp);
  const [transactionData, setTransactionData] = useState<{
    amount: any;
    date: string | null;
    transactionId: any;
  } | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getbillsForUser({ userId: user.id }));
  }, []);

  const pickImage = React.useCallback(async () => {
    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setImageError(false);
      const recognitionResult = await TextRecognition.recognize(
        result.assets[0].uri
      );
      const foundDetails = parseUPIScreenshotText(recognitionResult.text);
      setTransactionData(foundDetails);
      setIsLoading(false);
      console.log("Text recognition result:", foundDetails);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = React.useCallback(() => {}, []);

  const isTransactionDataValid = (td: typeof transactionData) =>
    hasRequiredFields(td);

  return (
    <View style={styles.ccStyle}>
      {!billForLastMonth ? (
        <EmptyView message={strings.bills.billNotFound} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.containerStyle}>
              <Text style={styles.dateRange}>
                Bill For{" "}
                {`${moment(billForLastMonth?.fromDate).format("MMMM")} ${moment(
                  billForLastMonth?.fromDate
                ).format("DD")} - ${moment(billForLastMonth?.toDate).format(
                  "DD"
                )}, ${moment(billForLastMonth?.toDate).format("YYYY")}`}
              </Text>

              <View style={styles.rowBetween}>
                <Text style={styles.label}>{strings.bills.daysPresent}</Text>
                <Text style={styles.value}>
                  {billForLastMonth?.present} Days
                </Text>
              </View>

              <View style={styles.rowBetween}>
                <Text style={styles.label}>{strings.bills.daysAbsent}</Text>
                <Text style={styles.value}>
                  {billForLastMonth?.absent} Days
                </Text>
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
                <Text style={styles.value}>
                  Rs {billForLastMonth?.totalAmount}
                </Text>
              </View>

              <Text
                style={styles.sectionLabel}
              >{`${strings.bills.transactionImage} *`}</Text>

              <Pressable style={styles.uploadBtn} onPress={pickImage}>
                <Image
                  source={image ? { uri: image } : Images.roundIcon}
                  style={styles.imagePreview}
                />
                <Text
                  style={[styles.uploadBtnText, imageError && styles.errorRed]}
                >
                  {strings.bills.uploadImage}
                </Text>
              </Pressable>
              {isTransactionDataValid(transactionData) && (
                <>
                  <TextInputComponent
                    label={strings.bills.amount}
                    textValue={transactionData?.amount}
                    isEditable={false}
                    labelStyle={styles.inputLabelMargin}
                    containerStyleProp={styles.inputContainer90}
                  />
                  <TextInputComponent
                    label={strings.bills.date}
                    textValue={transactionData?.date}
                    isEditable={false}
                    labelStyle={styles.inputLabelMargin}
                    containerStyleProp={styles.inputContainer90}
                  />
                  <TextInputComponent
                    label={strings.bills.transactionId}
                    textValue={transactionData?.transactionId}
                    isEditable={false}
                    labelStyle={styles.inputLabelMargin}
                    containerStyleProp={styles.inputContainer90}
                  />
                </>
              )}
            </View>
          </ScrollView>
          <Button
            label={strings.common.submit}
            onClick={handleSubmit}
            buttonStyle={styles.submitBtn}
            disabled={!isTransactionDataValid(transactionData)}
          />
          {(isLoading || isLoader) && <Loader />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ccStyle: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerStyle: {
    paddingTop: "10%",
    paddingHorizontal: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  dateRange: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textColor,
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
    backgroundColor: Colors.white,
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
  inputLabelMargin: {
    marginTop: 16,
  },
  inputContainer90: {
    width: "95%",
    marginTop: 10,
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
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
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
