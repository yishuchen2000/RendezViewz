import React from "react";
import { StyleSheet, View, Text, Dimensions, Pressable } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Success = ({ navigation, route }) => {
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
      <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
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
      <Pressable
        style={styles.button}
        onPress={() => {
          navigation.goBack();
          navigation.goBack();
        }}
      >
        <Text style={{ color: "purple", fontSize: 20 }}>
          Return to calendar
        </Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
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

export default Success;
