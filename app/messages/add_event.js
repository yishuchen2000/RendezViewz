import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { initialItems } from "./first_screen";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MultiSelect } from "react-native-element-dropdown";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Entypo } from "@expo/vector-icons";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
//import DropdownList from "react-widgets/DropdownList";
//import "react-widgets/styles.css";

const shows = [
  { label: "Alice in Wonderland", value: "1" },
  { label: "Barbie", value: "2" },
  { label: "Bees", value: "3" },
  { label: "The Godfather", value: "4" },
  { label: "The Notebook", value: "5" },
  { label: "The Shining", value: "6" },
  { label: "Titanic", value: "7" },
];

const people = [
  { label: "Dave", value: "1" },
  { label: "Victoria", value: "2" },
  { label: "Zach", value: "3" },
  { label: "Mona", value: "4" },
  { label: "Sean", value: "5" },
  { label: "Aaron", value: "6" },
  { label: "Natalie", value: "7" },
];

const AddEvent = ({ route, navigation }) => {
  const [show, setShow] = useState(null);
  const [person, setPerson] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [value, setValue] = useState(dayjs().format("YYYY-MM-DD"));
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState(dayjs().format("HH:mm"));
  const [items, setItems] = useState(initialItems);

  const handleAddEvent = () => {
    // Create a new event object with the entered data
    const newEvent = {
      name: show,
      people: person,
      time: time,
      date: date,
    };

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (!updatedItems[value]) {
        updatedItems[value] = [newEvent];
      } else {
        updatedItems[value].push(newEvent);
      }
      console.log("Updated Items:", updatedItems);
      return updatedItems;
    });

    navigation.navigate("success", {
      date: newEvent.date,
      name: newEvent.name,
      people: newEvent.people,
      time: newEvent.time,
    });
  };

  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.eachBox1}>
        <DateTimePicker
          value={value}
          onValueChange={(date) => {
            const formattedDate = dayjs(date);
            const datePart = formattedDate.format("YYYY-MM-DD"); // Extract date part
            const timePart = formattedDate.format("HH:mm"); // Extract time part

            console.log(datePart);
            console.log(timePart);
            setValue(datePart);
            setTime(timePart);
            setDate(datePart);
          }}
          calendarTextStyle={{ color: "black" }}
          selectedTextStyle={{ color: "white" }}
          selectedItemColor="purple"
          headerTextStyle={{ color: "white" }}
          headerButtonColor="purple"
          weekDaysTextStyle={{ color: "white" }}
          //customStyles={customStyles}
        />
      </View>
      <View style={styles.eachBox}>
        <Ionicons name="ios-film-outline" size={30} color="white" />
        <View style={styles.input}>
          <Dropdown
            style={styles.dropdown1}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={shows}
            search
            maxHeight={300}
            labelField="label"
            valueField="label"
            placeholder="Select Content"
            searchPlaceholder="Search..."
            value={show}
            onChange={(item) => {
              setShow(item.label);
              console.log(item.label);
            }}
          />
        </View>
      </View>
      <View style={styles.eachBox}>
        <Ionicons name="ios-people" size={30} color="white" />
        <View style={styles.input}>
          <View style={styles.input1}>
            <MultiSelect
              style={styles.dropdown2}
              placeholderStyle={styles.placeholderStyle2}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={people}
              labelField="label"
              valueField="label"
              placeholder="Add People"
              value={person}
              search
              searchPlaceholder="Search..."
              onChange={(item) => {
                setPerson(item);
                console.log(item);
              }}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                <Pressable onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.label}</Text>
                    <Entypo name="cross" size={15} color="black" />
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </View>
      <Pressable style={styles.button} onPress={handleAddEvent}>
        <Text style={{ color: "purple", fontSize: 15 }}>Send Invites</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    //padding: 24,
    backgroundColor: "transparent",
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: 300,
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  input1: {
    width: 300,
    height: 30,
    flexDirection: "column",
    justifyContent: "start",
    //paddingBottom: 30,
    //alignItems: "center",
    borderRadius: 15,
    //margin: 10,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
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
    bottom: 7,
    //right: 20,
  },
  eachBox: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eachBox1: {
    padding: 5,
    width: 340,
    height: 350,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dropdown: {
    color: "purple",
    height: 50,
    width: 275,
    borderRadius: 50,
  },
  dropdown1: {
    color: "purple",
    height: 50,
    width: 275,
    borderRadius: 50,
  },
  dropdown2: {
    color: "purple",
    height: 30,
    width: 275,
    borderRadius: 50,
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
  },
  iconStyle: {
    width: 10,
    aspectRatio: 1,
  },
  selectedStyle: {
    flexDirection: "row",
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    shadowColor: "#000",
    marginTop: 7,
    marginRight: 7,
    paddingLeft: 5,
    //paddingHorizontal: 12,
    //paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
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
});

export default AddEvent;
