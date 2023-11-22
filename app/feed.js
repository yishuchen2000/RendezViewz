import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import { Link } from "expo-router";

export default function Page() {
  const [selected, setSelected] = useState("");
  const [items, setItems] = useState({
    "2023-11-21": [
      { name: "test 1", people: ["Alexa", "Bernard", "Carrie"] },
      { name: "test 3", people: ["A", "B"] },
      { name: "test 4", people: ["A", , "C"] },
    ],
    "2023-11-30": [{ name: "test 2", people: ["A"] }],
  });

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={{ fontSize: 20, color: "purple" }}>{item.name}</Text>
        <Text style={{ fontSize: 10, color: "gray" }}>
          {item.people.toString()}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.main}>
        <View style={styles.cal}>
          <Text style={{ fontSize: 25, color: "white" }}>My Schedule</Text>
        </View>
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
          items={items}
          renderItem={renderItem}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
    borderColor: "red",
    borderWidth: 5,
  },
  main: {
    height: windowHeight * 0.5,
    width: windowWidth,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
    borderColor: "blue",
    borderWidth: 5,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",
    borderWidth: 5,
    borderColor: "green",
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
});
