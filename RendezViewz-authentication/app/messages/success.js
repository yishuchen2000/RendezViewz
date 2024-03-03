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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Success = ({ navigation, route }) => {
  const { date, name, time, people, all } = route.params;
  const photoMap = {};
  all.forEach((person) => {
    if (person.label && person.photo) {
      photoMap[person.label] = person.photo;
    }
  });
  const [showAllPeople, setShowAllPeople] = useState(false);
  const renderAllPeopleCircles = () => {
    return people.map((personName, index) => {
      const photoUri = photoMap[personName];
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
    });
  };

  const renderPeopleCircles = () => {
    const maxPeopleToShow = 4;
    const abbreviatedPeople = showAllPeople
      ? people
      : people.slice(0, maxPeopleToShow);
    const remainingPeopleCount = people.length - maxPeopleToShow;

    const abbreviatedNames = abbreviatedPeople.map((personName, index) => {
      const photoUri = photoMap[personName];
      return (
        <View key={index} style={styles.personCircle}>
          <Image
            source={{ uri: photoUri }}
            style={{ width: 45, height: 45, borderRadius: 22.5 }}
          />
          <Text style={styles.circletext}>{personName}</Text>
        </View>
      );
    });

    if (remainingPeopleCount > 0 && !showAllPeople) {
      abbreviatedNames.push(
        <Pressable key={maxPeopleToShow} onPress={() => setShowAllPeople(true)}>
          <Text
            style={[styles.circletext1, { textDecorationLine: "underline" }]}
          >
            {`Show ${remainingPeopleCount} others`}
          </Text>
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
        <View style={styles.c}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Congrats! Event scheduled:
          </Text>

          <MaterialCommunityIcons
            name="movie-filter"
            size={150}
            color="white"
            marginTop={10}
            marginBottom={10}
          />
          <Text
            style={{
              color: "white",
              fontSize: 20,
              textAlign: "center",
              marginBottom: 10,
              fontWeight: "bold",
            }}
          >
            {date} @ {time}
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {name}
          </Text>
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
          <Pressable
            style={styles.button}
            onPress={() => {
              navigation.goBack();
              navigation.goBack();
            }}
          >
            <Text style={{ color: "purple", fontSize: 15 }}>
              Return to calendar
            </Text>
          </Pressable>
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
    justifyContent: "center",
    //padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
    //flexWrap: "wrap",
  },
  button: {
    marginTop: 50,
    height: 40,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: "white",
  },
  peopleContainer: {
    width: windowWidth * 0.8,
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
  circletext1: {
    fontSize: 15,
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  scrollView: {},
  c: {
    alignItems: "center",
  },
});

export default Success;
