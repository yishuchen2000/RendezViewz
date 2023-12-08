import { StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Link } from "expo-router";

export default function Page() {
  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require("../assets/Alexa.png")}
          style={styles.profilePic}
        />
        <Text style={styles.title}>Alexa P.</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
    backgroundColor: "pink", //light pink
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
