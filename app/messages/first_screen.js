//This is the original authentication and top tracks page.
//It is the first page that shows upon opening app
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
//import { useNavigation, Link, Stack } from "expo-router";
//import { StatusBar } from "expo-status-bar";
//import { WebView } from "react-native-webview";
//import _debounce from 'lodash/debounce';
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export const initialItems = {
  "2023-11-23": [
    {
      name: "IT",
      people: ["Alexa", "Bernard", "Carrie"],
      time: "19:00",
      date: "2023-11-23",
    },
    {
      name: "How I Met Your Mother",
      people: ["Lizzy"],
      time: "18:00",
      date: "2023-11-23",
    },
  ],
  "2023-11-24": [
    { name: "Her", people: ["Zach"], time: "20:00", date: "2023-11-24" },
  ],
  "2023-11-25": [
    {
      name: "Hunger Games",
      people: ["Mia", "Alex"],
      time: "19:00",
      date: "2023-11-25",
    },
  ],
  "2023-11-26": [
    {
      name: "The Ultimatum",
      people: ["David"],
      time: "21:00",
      date: "2023-11-26",
    },
  ],
  "2023-11-27": [
    { name: "Saltburn", people: ["Anna"], time: "18:00", date: "2023-11-27" },
  ],
  "2023-11-28": [
    { name: "Trolls", people: ["Kevin"], time: "21:30", date: "2023-11-28" },
  ],
  "2023-11-29": [
    {
      name: "Pulp Fiction",
      people: ["Aiden", "Zev"],
      time: "21:30",
      date: "2023-11-29",
    },
  ],
  "2023-11-30": [
    {
      name: "Forrest Gump",
      people: ["Nick"],
      time: "21:30",
      date: "2023-11-30",
    },
  ],
  "2023-12-01": [
    {
      name: "Interstellar",
      people: ["Natalie", "Kenna"],
      time: "21:30",
      date: "2023-12-01",
    },
  ],
  "2023-12-02": [
    {
      name: "Love is Blind",
      people: ["Aaron"],
      time: "21:30",
      date: "2023-12-02",
    },
  ],
  "2023-12-03": [
    {
      name: "Ted Lasso",
      people: ["Zoe", "Nick", "Larsen"],
      time: "18:00",
      date: "2023-12-03",
    },
  ],
  "2023-12-04": [
    {
      name: "American Ninja Warriors",
      people: ["Diane", "Kiki"],
      time: "18:00",
      date: "2023-12-04",
    },
  ],
  "2023-12-05": [
    { name: "Barbie", people: ["Cindy"], time: "19:00", date: "2023-12-05" },
  ],
  "2023-12-06": [
    {
      name: "The Grinch",
      people: ["Sean"],
      time: "22:00",
      date: "2023-12-06",
    },
  ],

  "2023-12-07": [
    { name: "Holidate", people: ["Lola"], time: "23:00", date: "2023-12-07" },
  ],
  "2023-12-08": [
    {
      name: "Parasite",
      people: ["Annie"],
      time: "21:30",
      date: "2023-12-08",
    },
  ],
  "2023-12-09": [
    {
      name: "Last Christmas",
      people: ["Dave"],
      time: "19:00",
      date: "2023-12-09",
    },
  ],
  "2023-12-10": [
    {
      name: "Spirited Away",
      people: ["Emma"],
      time: "19:00",
      date: "2023-12-10",
    },
  ],
  "2023-12-11": [
    {
      name: "Almost Christmas",
      people: ["Emily", "Jane", "Jolie"],
      time: "22:00",
      date: "2023-12-11",
    },
  ],
  "2023-12-12": [
    {
      name: "The Polar Express",
      people: ["Amy"],
      time: "22:00",
      date: "2023-12-12",
    },
  ],
  "2023-12-13": [
    {
      name: "Home Alone",
      people: ["Nancy"],
      time: "22:00",
      date: "2023-12-13",
    },
  ],
  "2023-12-14": [
    {
      name: "Alice in Wonderland",
      people: ["Jamie"],
      time: "19:00",
      date: "2023-12-14",
    },
  ],
  "2023-12-15": [
    {
      name: "The Holiday",
      people: ["Josh"],
      time: "22:00",
      date: "2023-12-15",
    },
  ],
  "2023-12-16": [
    {
      name: "Four Chrismases",
      people: ["Dave"],
      time: "22:00",
      date: "2023-12-16",
    },
  ],
  "2023-12-17": [
    {
      name: "The Nightmare Before Christmas",
      people: ["Alice"],
      time: "22:00",
      date: "2023-12-17",
    },
  ],
  "2023-12-18": [
    {
      name: "Bad Santa",
      people: ["Alicia"],
      time: "19:00",
      date: "2023-12-18",
    },
  ],
  "2023-12-19": [
    {
      name: "A Christmas Story",
      people: ["Whitney"],
      time: "22:00",
      date: "2023-12-19",
    },
  ],
  "2023-12-20": [
    { name: "Gremlins", people: ["Zola"], time: "21:30", date: "2023-12-20" },
  ],
  "2023-12-21": [
    { name: "Klaus", people: ["Zoe"], time: "19:00", date: "2023-12-21" },
  ],
  "2023-12-22": [
    {
      name: "White Christmas",
      people: ["Amisha", "Audrey"],
      time: "21:30",
      date: "2023-12-22",
    },
  ],
  "2024-03-01": [
    { name: "Tenet", people: ["David"], time: "19:00", date: "2023-03-01" },
  ],
};

export default function FirstScreen({ navigation }) {
  const [selected, setSelected] = useState("");
  const [items, setItems] = useState(initialItems);

  const removeEvent = (date, eventName) => {
    // Create a copy of the items
    const updatedItems = { ...items };
    // Find the index of the event to remove
    const index = updatedItems[date].findIndex(
      (event) => event.name === eventName
    );
    // Remove the event if found
    if (index !== -1) {
      updatedItems[date].splice(index, 1);
      setItems(updatedItems);
    }
  };

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.rowcont}>
          <View style={styles.eventInfo}>
            <Text style={{ fontSize: 17, color: "purple" }}>{item.name}</Text>
            <Text style={{ fontSize: 10, color: "gray" }}>{item.time}</Text>
            <Text style={{ fontSize: 10, color: "gray" }}>
              {item.people.join(", ")}
            </Text>
          </View>
          <Pressable
            onPress={() => removeEvent(item.date, item.name)}
            style={styles.removeButton}
          >
            <AntDesign name="close" size={20} color="gray" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.main}>
        <Agenda
          style={{ width: "100%", height: "100%" }}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#602683",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#602683",
            dayTextColor: "#2d4150",
            textDisabledColor: "#c6c7c9",
            arrowColor: "#602683",
            dotColor: "#602683",
          }}
          onDayPress={(day) => {
            setSelected(day.dateString);
            console.log("selected day", day);
          }}
          items={initialItems}
          renderItem={renderItem}
        />
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("add_event", {})}
          >
            <AntDesign name="pluscircle" size={50} color="#602683" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  rowcont: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  main: {
    flex: 1,
    // height: windowHeight * 0.5,
    // width: windowWidth,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
    // padding: 5,
    borderWidth: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "start",
    flex: 1,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",

    alignItems: "center",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "transparent", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
});
