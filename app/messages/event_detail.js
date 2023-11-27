//This file is the webview page for song details.
//This page is opened when clicking anywhere on the row of a song on first_screen
import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const EventDetail = ({ route }) => {
  const { date, name, time, people } = route.params;
  const renderPeopleCircles = () => {
    return people.map((person, index) => (
      <View key={index} style={styles.personCircle}>
        <Ionicons
          name="person-circle-outline"
          size={45}
          color="rgba(255, 255, 255, 0.8)"
        />
        <Text style={styles.circletext}>{person}</Text>
      </View>
    ));
  };
  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.overall}>
        <View style={styles.time}>
          <Text style={styles.date}>
            {date} @ {time}
          </Text>
        </View>

        <View style={styles.time}>
          <Text style={styles.show}>{name}</Text>
        </View>
        <View style={styles.image}></View>
        <View style={styles.peopleContainer}>{renderPeopleCircles()}</View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  overall: {
    flexDirection: "column",
    alignItems: "center",
    //padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  time: {
    alignItems: "center",
    margin: 10,
  },
  date: {
    fontSize: 25,
    color: "white",
  },
  hour: {
    fontSize: 20,
    color: "white",
  },
  show: {
    fontSize: 40,
    color: "white",
    textAlign: "center",
  },
  image: {
    height: windowHeight * 0.3,
    width: windowWidth * 0.6,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10,
  },
  peopleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    flexWrap: "wrap", // This line makes the content wrap within the container
  },
  personCircle: {
    margin: 2,
    height: 70,
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

export default EventDetail;
