import { roundIcon } from "@/assets/images";
import { Button } from "@/components/Button";
import { TextInputComponent } from "@/components/TextInputView";
import { strings } from "@/constants/AppStrings";
import { Colors } from "@/constants/Colors";
import moment from "moment";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
const ApplyLeavesScreen = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDays, setSelectedDays] = useState("");

  const [isFrom, setIsFrom] = useState(true);
  const [showCalender, setShowCalender] = useState(false);

  const minDate = moment().add(1, "days").format("YYYY-MM-DD").toString();
  const maxDate = moment().add(60, "days").format("YYYY-MM-DD").toString();

  const fromDateChoose = (date: string) => {
    setFromDate(date);
  };
  const toDateChoose = (date: string) => {
    setToDate(date);
    const date1 = moment(fromDate); // Example date 1
    const date2 = moment(date); // Example date 2
     const daysDifference = date2.diff(date1, 'days');
    console.log("ewewewe", daysDifference);

    setSelectedDays(daysDifference.toString());
  };

  const submitLeavesClick = () => {};

  const openCanlendar = (isFrom: boolean) => {
    setShowCalender(true);
    setIsFrom(isFrom);
  };

  return (
    <View style={styles.containerStyle}>
      <Text> Apply Leave {selectedDays}</Text>
      <>
        <TextInputComponent
          placeholderText={strings.leave.fromDate}
          textValue={
            fromDate === ""
              ? fromDate
              : moment(fromDate).format("DD-MM-YYYY").toString()
          }
          onChange={fromDateChoose}
          image={roundIcon}
          imageOnClick={() => openCanlendar(true)}
        />
        <TextInputComponent
          placeholderText={strings.leave.toDate}
          textValue={
            toDate === ""
              ? toDate
              : moment(toDate).format("DD-MM-YYYY").toString()
          }
          onChange={toDateChoose}
          image={roundIcon}
          imageOnClick={() => openCanlendar(false)}
        />
        <Button
          buttonStyle={styles.buttonStyle}
          label={strings.leave.submitLeave}
          onClick={submitLeavesClick}
        />
      </>
      {showCalender && (
        <Calendar
          style={{
            position: "absolute",
            alignSelf: "center",
            zIndex: 1,
            top: -300,
            borderRadius: 20,
          }}
          theme={{
            arrowColor: Colors.primary,
            todayTextColor: Colors.disabledColor,
            selectedDayBackgroundColor: Colors.primary,
            monthTextColor: Colors.textColor,
            dayTextColor: Colors.textColor,
          }}
          current={isFrom ? fromDate : toDate}
          minDate={!isFrom && fromDate ? fromDate : minDate}
          maxDate={maxDate}
          onDayPress={(day) => {
            if (isFrom) {
              setFromDate(day.dateString);
            } else {
              setToDate(day.dateString);
            }
            setShowCalender(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 30,
  },
  buttonStyle: {
    marginTop: 40,
  },
});

export default ApplyLeavesScreen;
