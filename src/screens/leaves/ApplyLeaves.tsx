import { roundIcon } from "@/assets/images";
import { Button } from "@/src/components/Button";
import { Loader } from "@/src/components/Loader";
import { TextInputComponent } from "@/src/components/TextInputView";
import { strings } from "@/src/constants/AppStrings";
import { Colors } from "@/src/constants/Colors";
import { applyLeave, resetApplyLeave } from "@/src/store/reducers/leaveSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";

const ApplyLeaves = () => {
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDays, setSelectedDays] = useState("");

  const [isFrom, setIsFrom] = useState(true);
  const [showCalender, setShowCalender] = useState(false);

  const minDate = moment().add(1, "days").format("YYYY-MM-DD").toString();
  const maxDate = moment().add(30, "days").format("YYYY-MM-DD").toString();
  const leavesResponse = useSelector((state: any) => state.leave);
  const { isLoading, applyLeaveResponse } = leavesResponse;

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    if (applyLeaveResponse) {
      Alert.alert(
        strings.headers.applyLeave,
        strings.leave.applyLeaveSuccess,
        [
          {
            text: strings.alert.cancel,
            style: "cancel",
          },
          {
            text: strings.alert.ok,
            onPress: clearFunc,
          },
        ],
        { cancelable: true }
      );
    }
  }, [leavesResponse]);

  const clearFunc = () => {
    setFromDate("");
    setToDate("");
    setSelectedDays("");
    dispatch(resetApplyLeave());
  };

  const submitLeavesClick = () => {
    const leaveObj = {
      user: {
        id: user.id,
      },
      fromDate: fromDate,
      toDate: toDate,
    };
    dispatch(applyLeave(leaveObj));
  };

  const openCanlendar = (isFrom: boolean) => {
    setShowCalender(true);
    setIsFrom(isFrom);
    setSelectedDays('')
  };

  return (
    <View style={styles.containerStyle}>
      <>
        <TextInputComponent
          placeholderText={strings.leave.fromDate}
          textValue={
            fromDate === ""
              ? fromDate
              : moment(fromDate).format("DD-MM-YYYY").toString()
          }
          isEditable={false}
          image={roundIcon}
          imageOnClick={() => openCanlendar(true)}
        />
        <TextInputComponent
          isEditable={false}
          placeholderText={strings.leave.toDate}
          textValue={
            toDate === ""
              ? toDate
              : moment(toDate).format("DD-MM-YYYY").toString()
          }
          image={roundIcon}
          imageOnClick={() => openCanlendar(false)}
        />
        {selectedDays === "" ? null : (
          <Text style={styles.textStyle}>
            you have choosen {selectedDays} days leaves
          </Text>
        )}

        <Button
          buttonStyle={styles.buttonStyle}
          label={strings.common.submit}
          onClick={submitLeavesClick}
        />
      </>
      {showCalender && (
        <Calendar
          style={styles.calendarStyle}
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
              setIsFrom(false);
            } else {
              const date1 = moment.utc(fromDate); // Example date 1
              const date2 = moment.utc(day.dateString); // Example date 2
              const daysDifference = date2.diff(date1, "days");
              setToDate(day.dateString);
              setSelectedDays((daysDifference + 1).toString());
            }
            setShowCalender(false);
          }}
        />
      )}
      {isLoading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: "center",
    paddingTop: "35%",
  },
  buttonStyle: {
    marginTop: 40,
  },
  textStyle: {
    fontSize: 18,
    color: Colors.textColor,
    marginTop: 30,
    fontStyle: "italic",
  },
  calendarStyle: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 1,
    top: -300,
    borderRadius: 20,
  },
});

export default ApplyLeaves;
