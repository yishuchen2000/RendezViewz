import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  ScrollView,
  Alert,
  Image,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { initialItems } from "./eventdata";
import { Ionicons } from "@expo/vector-icons";
//import { MultiSelect } from "react-native-element-dropdown";
import { Dropdown } from "react-native-element-dropdown";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
//import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-native-modern-datepicker";
import MultiSelect from "react-native-multiple-select";
//import DropDownPicker from "react-native-dropdown-listpicker";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import CustomModal from "./custommodal";

import dayjs from "dayjs";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const shows = [
  { label: "Alice in Wonderland", value: "1" },
  { label: "Barbie", value: "2" },
  { label: "Bees", value: "3" },
  { label: "The Godfather", value: "4" },
  { label: "The Notebook", value: "5" },
  { label: "The Shining", value: "6" },
  { label: "Titanic", value: "7" },
];

const AddEvent = ({ route, navigation }) => {
  const [show, setShow] = useState(null);
  const [person, setPerson] = useState([]);

  //const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  //const [mode, setMode] = useState("date");
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(dayjs().format("HH:mm"));
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [pickeddate, setpickeddate] = useState(true);
  const [pickedtime, setpickedtime] = useState(true);
  const [text, setText] = useState(false);
  const [textT, setTextT] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalon, setModalon] = useState(false);

  const [Plist, setPlist] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await supabase.from("friends").select("*");
        if (response.error) {
          throw new Error(response.error.message);
        }
        const peopleData = response.data.map((person) => ({
          label: person.user,
          value: person.id.toString(), // Assuming you want to use the person's ID as the value
          photo: person.profile_pic,
        }));
        setPlist(peopleData);
        //console.log(peopleData);
        //setPeople(peopleData); // Update the people array with the fetched data
      } catch (error) {
        console.error("Error fetching people:", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Set the initial date state to today's date when the component mounts
    setDate(dayjs().format("YYYY-MM-DD"));
    setTime(dayjs().format("HH:mm"));
  }, []);
  //Date

  // functions for date modal
  function handleOnPressOpen() {
    setOpen(!open);
    setModalon(!modalon);
  }
  function handleChange(selectedDate) {
    // Set date to pressed date
    setDate(dayjs(selectedDate).format("YYYY-MM-DD"));
    //console.log(selectedDate);
  }
  function handleChange1(date) {
    // Format the selected date
    setText(date);
    //console.log(text);
    setpickeddate(false);
    setOpen(!open);
    setModalon(!modalon);
  }

  // functions for time modal
  function handleTimePickerPressOpen() {
    setShowTimePicker(!showTimePicker);
    setModalon(!modalon);
  }

  function handleTimeChange(selectedTime) {
    setTime(selectedTime);
    //console.log(selectedTime);
    setTextT(selectedTime);
    //console.log(textT);
    setpickedtime(false);

    setShowTimePicker(!showTimePicker);
    setModalon(!modalon);
  }

  const handleSelectedPeople = (selectedPeople) => {
    // Extracting only the labels from the Plist array based on the selected values
    const personLabels = Plist.filter((person) =>
      selectedPeople.includes(person.value)
    ).map((person) => person.label);
    // Setting the person state with the extracted labels
    setPerson(personLabels);
    //console.log("main doc set people:", personLabels);
  };

  const handleAddEvent = async () => {
    if (pickeddate) {
      // Show an alert for missing date
      Alert.alert("Error", "Please select a date before sending the invite.");
      return;
    }
    if (pickedtime) {
      // Show an alert for missing time
      Alert.alert("Error", "Please select a time before sending the invite.");
      return;
    }
    if (!show) {
      // Show an alert for missing show
      Alert.alert("Error", "Please select a show before sending the invite.");
      return;
    }
    if (person.length === 0) {
      // Show an alert for missing people
      Alert.alert("Error", "Please select people before sending the invite.");
      return;
    }

    try {
      // Check if an event with the same date and show already exists
      const { data, error } = await supabase
        .from("party")
        .select()
        .eq("date", date)
        .eq("show", show);

      if (error) {
        throw new Error(error.message);
      }

      // If a row with the same date and show exists, raise an error
      if (data && data.length > 0) {
        Alert.alert(
          "Error",
          "An event with the same date and show already exists."
        );
        return; // Prevent navigation if event already exists
      }

      // If the entry doesn't exist, proceed with the insertion
      const { insertError } = await supabase
        .from("party")
        .insert([{ date: date, people: person, show: show, time: time }]);

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Show success message to the user
      navigation.navigate("success", {
        date: date,
        name: show,
        people: person,
        time: time,
        all: Plist,
      });
    } catch (error) {
      Alert.alert("Error", `Failed to add event: ${error.message}`);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setModalon(!modalon);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalon(!modalon);
  };

  const renderPeopleCircles = () => {
    return person.map((personName, index) => {
      // Find the corresponding person object in the Plist array
      const selectedPerson = Plist.find((item) => item.label === personName);
      // Check if the person is found
      if (selectedPerson) {
        const photoUri = selectedPerson.photo;
        return (
          <View key={index} style={styles.personCircle}>
            <Image
              source={{ uri: photoUri }}
              style={{ width: 45, height: 45, borderRadius: 22.5 }}
            />
            <Text numberOfLines={1} style={styles.circletext}>
              {personName}
            </Text>
          </View>
        );
      }
      return null; // Return null if the person is not found
    });
  };

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.top}>
          <View style={styles.wicon}>
            <FontAwesome name="calendar-o" size={27} color="white" />
            <Pressable onPress={handleOnPressOpen} style={styles.datepick}>
              <Text style={pickeddate ? styles.placeholder : styles.hooray}>
                {pickeddate ? "Select Date" : text}
              </Text>
            </Pressable>
            <CustomModal
              modalVisible={modalVisible}
              closeModal={closeModal}
              handleSelectedPeople={handleSelectedPeople} // Make sure you're passing it here
              plist={Plist}
            />
          </View>
          <View style={styles.wicon}>
            <FontAwesome5 name="clock" size={27} color="white" />
            <Pressable
              onPress={handleTimePickerPressOpen}
              style={styles.datepick}
            >
              <Text style={pickedtime ? styles.placeholder : styles.hooray}>
                {pickedtime ? "Select Time" : textT}
              </Text>
            </Pressable>
          </View>

          <Modal animationType="none" transparent={true} visible={open}>
            <View style={styles.centeredView}>
              {modalon && (
                <View
                  //activeOpacity={1}
                  //onPress={closeModal}
                  style={styles.blur}
                >
                  <View style={styles.modalView}>
                    <DatePicker
                      options={{
                        backgroundColor: "white",
                        textHeaderColor: "purple",
                        textDefaultColor: "rgba(230, 70, 150, 1)",
                        selectedTextColor: "white",
                        mainColor: "purple",
                        textSecondaryColor: "purple",
                      }}
                      testID="dateTimePicker"
                      value={date}
                      mode="calendar"
                      selected={date}
                      onDateChange={handleChange}
                    />
                    <View
                      style={{
                        backgroundColor: "purple",
                        borderRadius: 10,
                        marginBottom: 10,
                      }}
                    >
                      {/* Call handleDateSelect when the "Select" button is pressed */}
                      <Button
                        title="Select"
                        color="white"
                        onPress={() => handleChange1(date)}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </Modal>
          <Modal
            animationType="none"
            transparent={true}
            visible={showTimePicker}
          >
            <View style={styles.centeredView}>
              {modalon && (
                <View
                  //activeOpacity={1}
                  //onPress={closeModal}
                  style={styles.blur}
                >
                  <View style={styles.modalView}>
                    <DatePicker
                      options={{
                        backgroundColor: "white",
                        textHeaderColor: "purple",
                        textDefaultColor: "rgba(230, 70, 150, 1)",
                        selectedTextColor: "white",
                        mainColor: "purple",
                        textSecondaryColor: "purple",
                      }}
                      mode="time"
                      onTimeChange={handleTimeChange}
                    />
                  </View>
                </View>
              )}
            </View>
          </Modal>
        </View>
        <View style={styles.ccontainer}>
          <View style={styles.eachBox}>
            <Ionicons name="ios-film-outline" size={30} color="white" />
            <View style={styles.input}>
              <Dropdown
                style={styles.dropdown1}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.selecttext}
                iconStyle={styles.iconStyle}
                data={shows}
                search
                maxHeight={200}
                labelField="label"
                valueField="label"
                placeholder="Select Content"
                searchPlaceholder="Search..."
                value={show}
                onChange={(item) => {
                  setShow(item.label);
                  //console.log(item.label);
                }}
              />
            </View>
          </View>
          <View style={styles.eachBox}>
            <Ionicons name="ios-people" size={30} color="white" />
            <Pressable onPress={openModal} style={styles.input}>
              <View style={styles.input1}>
                <Text
                  style={[styles.replaceText, { fontSize: 17, color: "grey" }]}
                >
                  {person.length > 0
                    ? "Click here to edit people list"
                    : "Select people"}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.peopleContainer}>{renderPeopleCircles()}</View>

          <View style={styles.space}></View>
        </View>
      </ScrollView>
      <Pressable style={styles.button} onPress={handleAddEvent}>
        <Text style={{ color: "purple", fontSize: 15 }}>Send Invites</Text>
      </Pressable>
      <View style={styles.clapboard}>
        <Image
          source={require("../../assets/Clapboard2.png")}
          style={{
            flex: 1,
            width: windowWidth,
            resizeMode: "stretch",
          }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height: "90%",
    //alignItems: "center",
    //borderWidth: 5,
    //borderColor: "red",
  },
  space: {
    height: 500,
  },
  bottom: {
    height: 300,
    justifyContent: "end",
    //borderWidth: 5,
    //borderColor: "green",
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    //padding: 24,
    backgroundColor: "transparent",
  },
  ccontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    //padding: 24,
    backgroundColor: "transparent",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    position: "absolute",
    bottom: windowHeight * 0,
    alignSelf: "center",
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    //borderColor: "blue",
    //borderWidth: 5,
  },
  input1: {
    width: windowWidth * 0.7,
    height: 30,
    flexDirection: "column",
    justifyContent: "center",
    //paddingBottom: 30,
    //alignItems: "center",
    //borderRadius: 15,
    //margin: 10,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    //borderColor: "green",
    //borderWidth: 5,
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "white",
    width: 200,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
    bottom: windowHeight * 0.05,
    //right: 20,
  },
  selecttext: {
    color: "purple",
  },
  eachBox: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    //borderColor: "purple",
    //borderWidth: 5,
  },
  eachBox1: {
    felx: 1,
    padding: 5,
    width: windowWidth * 0.88,
    height: windowHeight * 0.41,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    //borderColor: "red",
    //borderWidth: 5,
  },
  dropdown: {
    color: "purple",
    height: 50,
    width: windowWidth * 0.7,
    borderRadius: 50,
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the alpha value for the darkness
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown1: {
    color: "purple",
    //height: windowHeight * 0.3,
    width: windowWidth * 0.65,
    borderRadius: 50,
    //borderColor: "gray",
    //borderWidth: 5,
  },
  dropdown2: {
    color: "purple",
    height: 30,
    width: windowWidth * 0.65,
    //borderRadius: 50,
    //borderColor: "black",
    //borderWidth: 5,
  },
  icon: {
    marginRight: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "purple",
  },
  iconStyle: {
    width: 10,
    aspectRatio: 1,
  },
  selectedStyle: {
    flexDirection: "column",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    shadowColor: "#000",
    //activeColor: "red",
    marginTop: 8,
    marginRight: 7,
    paddingLeft: 5,
    paddingRight: 5,
    //paddingHorizontal: 12,
    //paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: "hidden",
  },
  textSelectedStyle: {
    color: "purple",
    marginRight: 5,
    fontSize: 13,
    alignSelf: "center",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "black",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  placeholderStyle2: {
    fontSize: 16,
    //alignSelf: "flex-start",
    color: "gray",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  top: {
    height: windowHeight * 0.075,
    width: windowWidth * 0.85,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    //borderWidth: 5,
    //borderColor: "blue",
    alignSelf: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    padding: 35,
    alignItems: "center",
  },
  datepick: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    height: "100%",
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
    height: windowHeight * 0.043,
  },
  wicon: {
    //margin: 5,
    width: "45%",
    height: "100%",

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    //borderWidth: 5,
    //borderColor: "purple",
  },
  placeholder: {
    color: "grey",
  },
  hooray: {
    color: "purple",
  },
  photo: {
    //borderWidth: 5,
    //borderColor: "purple",
    width: 50,
    height: 50,
  },
  peopleContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    paddingLeft: 25,
    margin: 10,
    flexWrap: "wrap",
    //borderWidth: 5,
    //borderColor: "purple",
  },
  personCircle: {
    margin: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  circletext: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
});

export default AddEvent;
