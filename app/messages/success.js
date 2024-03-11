import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  Image,
  Linking,
  Alert,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { LinearGradient } from "expo-linear-gradient";
import * as Calendar from "expo-calendar"; // Importing calendar module
import * as Localization from "expo-localization";
import ConfettiCannon from "react-native-confetti-cannon";

const Success = ({ navigation, route }) => {
  const { date, name, time, people, all, poster } = route.params;
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

  const addToCalendar = async () => {
    // Check for permission to access the calendar
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      // Get the default calendar ID
      const defaultCalendarId =
        Platform.OS === "ios"
          ? (await Calendar.getDefaultCalendarAsync()).id
          : (await Calendar.getCalendarsAsync()).find(
              (cal) => cal.accessLevel === "owner"
            ).id;

      // Set the time zone to the device's time zone
      const timeZone = Localization.timezone;

      // Create event object
      const eventDetails = {
        title: name,
        startDate: new Date(date + "T" + time),
        endDate: new Date(
          date +
            "T" +
            (parseInt(time.split(":")[0]) + 2) +
            ":" +
            time.split(":")[1]
        ), // Assuming event ends 2 hours later
        timeZone,
        availability: Calendar.Availability.BUSY,
        calendarId: defaultCalendarId, // Specify the calendar ID here
      };

      // Add event to calendar
      await Calendar.createEventAsync(defaultCalendarId, eventDetails)
        .then((event) => {
          // Event added successfully
          console.log("Event added to calendar:", event);
          Alert.alert("Success", "Event exported to calendar!");
        })
        .catch((error) => {
          // Error adding event
          console.error("Error adding event to calendar:", error);
        });
    } else {
      // Permission not granted
      console.log("Permission to access calendar was denied");
    }
  };

  const formatDateAndTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = dateTime.getDate();
    const monthIndex = dateTime.getMonth();
    const monthName = monthNames[monthIndex];

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formattedDate = `${monthName} ${day}${getDaySuffix(day)}`;
    const formattedTime = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <>
        <Text style={{ fontWeight: "normal" }}>
          {formattedDate}
          {" at "}
          {formattedTime}
        </Text>
      </>
    );
  };

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.c}>
          <Text
            style={{
              color: "white",
              fontSize: 25,
              textAlign: "center",
              margin: 18,
            }}
          >
            Congrats! Event scheduled:
          </Text>
          <Text
            style={{
              color: "white",
              fontSize: 24,
              marginTop: 20,
              marginBottom: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {name}
          </Text>
          <Image source={{ uri: poster }} style={styles.poster} />
          <Text
            style={{
              color: "white",
              fontSize: 24,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {formatDateAndTime(date, time)}
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
          ) : null}
          <Pressable
            style={styles.button}
            onPress={addToCalendar} // Call function on button press
          >
            <Text style={{ color: "purple", fontSize: 15 }}>
              Export event to calendar
            </Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              navigation.goBack();
              navigation.goBack();
            }}
          >
            <Text style={{ color: "purple", fontSize: 15 }}>Return home</Text>
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
      <ConfettiCannon
        count={75}
        origin={{ x: 0, y: 0 }}
        fadeOut={true}
        explosionSpeed={350}
        spread={300}
        colors={["purple", "lightblue"]}
      />
      <ConfettiCannon
        count={75}
        origin={{ x: windowWidth, y: 0 }}
        fadeOut={true}
        explosionSpeed={900}
        spread={300}
        colors={["purple", "lightblue"]}
      />
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
  poster: {
    height: windowHeight * 0.35,
    width: windowHeight * 0.22,
    marginBottom: 10,
    padding: 5,
  },
  button: {
    marginTop: 20,
    height: 40,
    width: 225,
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
    marginBottom: 10,
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
  scrollContainer: { paddingBottom: 60 },
  c: {
    alignItems: "center",
  },
});

export default Success;
