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
  ActivityIndicator,
  Alert,
} from "react-native";
import { initialItems } from "./eventdata";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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

  const doublecheck = (date, eventName) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to remove this event?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: () => removeEvent(date, eventName) },
      ],
      { cancelable: false }
    );
  };

  const renderItem = (item) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("event_detail", {
            date: item.date,
            name: item.name,
            people: item.people,
            time: item.time,
          })
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.rowcont}>
            <View style={styles.eventInfo}>
              <Text numberOfLines={1} style={{ fontSize: 17, color: "purple" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 10, color: "gray" }}>{item.time}</Text>
              <Text
                numberOfLines={1}
                //ellipsizeMode="tail"
                style={{ fontSize: 10, color: "gray" }}
              >
                {item.people.join(", ")}
              </Text>
            </View>
            <Pressable
              onPress={() => doublecheck(item.date, item.name)}
              style={styles.removeButton}
            >
              <AntDesign name="close" size={20} color="gray" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  if (!items) {
    return (
      <LinearGradient
        colors={["#361866", "#E29292"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="purple" />
          <Text style={{ color: "white" }}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

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
        <View style={styles.buttonContainer1}>
          <Pressable
            style={styles.button1}
            onPress={() => navigation.navigate("Inbox", {})}
          >
            <Feather name="mail" size={30} color="white" />
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("add_event", {})}
          >
            <AntDesign name="pluscircle" size={50} color="#602683" />
          </Pressable>
        </View>
      </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  rowcont: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    width: windowWidth * 0.65,
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
  inboxtext: {
    color: "white",
    fontSize: 15,
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
    width: 52,
    height: 52,
    borderRadius: 50,
    backgroundColor: "white", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#602683", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    width: 100,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#602683", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer1: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    right: windowHeight * 0.1,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  buttonContainer2: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    left: windowHeight * 0.02,
    backgroundColor: "transparent",
  },
  magnify: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.019,
    right: windowHeight * 0.097,
    zIndex: 2,
  },
});
