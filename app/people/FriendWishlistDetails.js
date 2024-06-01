import React from "react";
import { View, Image, StyleSheet, Dimensions, ScrollView } from "react-native";
import MovieDetails from "../../components/MovieDetails";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const FriendWishlistDetails = ({ route }) => {
  const { details } = route.params;

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <MovieDetails item={details} />
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

export default FriendWishlistDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  clapboardImage: {
    flex: 1,
    width: windowWidth,
    resizeMode: "stretch",
  },
});
