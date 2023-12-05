//This file is the webview page for song details.
//This page is opened when clicking anywhere on the row of a song on first_screen
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const EventDetail = ({ route }) => {
  const { date, name, time, people } = route.params;
  const [showAllPeople, setShowAllPeople] = useState(false);
  const renderAllPeopleCircles = () => {
    return people.map((person, index) => (
      <View key={index} style={styles.personCircle}>
        <Ionicons
          name="person-circle-outline"
          size={45}
          color="rgba(255, 255, 255, 0.8)"
        />
        <Text numberOfLines={1} style={styles.circletext}>
          {person}
        </Text>
      </View>
    ));
  };
  const renderPeopleCircles = () => {
    const maxPeopleToShow = 4;
    const abbreviatedPeople = showAllPeople
      ? people
      : people.slice(0, maxPeopleToShow);
    const remainingPeopleCount = people.length - maxPeopleToShow;

    const abbreviatedNames = abbreviatedPeople.map((person, index) => (
      <View key={index} style={styles.personCircle}>
        <Ionicons
          name="person-circle-outline"
          size={45}
          color="rgba(255, 255, 255, 0.8)"
        />
        <Text style={styles.circletext}>{person}</Text>
      </View>
    ));

    if (remainingPeopleCount > 0 && !showAllPeople) {
      abbreviatedNames.push(
        <Pressable key={maxPeopleToShow} onPress={() => setShowAllPeople(true)}>
          <Text
            style={[styles.circletext1, { textDecorationLine: "underline" }]}
          >{`Show ${remainingPeopleCount} others`}</Text>
        </Pressable>
      );
    }

    return abbreviatedNames;
  };
  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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
          {showAllPeople ? (
            <Pressable
              style={styles.collapseButton}
              onPress={() => setShowAllPeople(false)}
            >
              <Text
                style={[styles.circletext, { textDecorationLine: "underline" }]}
              >
                Show less people
              </Text>
            </Pressable>
          ) : (
            <View></View>
          )}
        </View>
      </ScrollView>
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
  container: {
    flex: 1,
    alignItems: "center",
    //padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
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
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  image: {
    height: windowHeight * 0.3,
    width: windowHeight * 0.25,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10,
  },
  peopleContainer: {
    flexDirection: "row",
    width: windowWidth * 0.8,
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
    paddingBottom: 10,
    color: "white",
    textAlign: "center",
  },
  circletext: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  circletext1: {
    fontSize: 15,
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
});

export default EventDetail;
