import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const FirstRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#ff4081" }} />
);

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Alexa.png")} // Replace with your image path
          style={styles.profilePic}
        />
        <Text style={styles.userName}>First Last</Text>
        <Text style={styles.userHandle}>@username</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#yourBackgroundColor", // Replace with your background color
  },
  header: {
    alignItems: "center",
    padding: 20,
    //create a red background
    backgroundColor: "#E29292",
    // Add other styles for the header
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // Add other styles for the profile picture
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    // Add other styles for the user name
  },
  userHandle: {
    fontSize: 18,
    color: "gray",
    // Add other styles for the user handle
  },
});

export default ProfileScreen;
