import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import supabase from "../Supabase";
import { AntDesign } from "@expo/vector-icons";
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
  Caladea_italic,
} from "@expo-google-fonts/imperial-script";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AppLoading from "expo-app-loading";

const LIKE_ICON_OUTLINE = require("../assets/like_regular_purple.png");
const LIKE_ICON_FILLED = require("../assets/like_solid_purple.png");

// const LIKE_ICON_OUTLINE = <AntDesign name="hearto" size={24} color="black" />;
// const LIKE_ICON_FILLED = <AntDesign name="heart" size={24} color="black" />;

const ProfilePost = ({
  id,
  user,
  timestamp,
  text,
  liked,
  imageSource,
  profilePic,
  action,
  // comments,
}) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={profilePic} />
            </View>

            <Text style={styles.username}>{user}</Text>
          </View>
          <Text style={{ color: "white" }}>{timestamp}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.postContent}>
            <Text style={styles.action}>{action}</Text>
            <View style={styles.contentContainer}>
              <Text style={styles.content}>{text}</Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePost;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 15,
    padding: 8,
    width: "100%",
    marginBottom: 10,
    gap: 4,
    textColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 5,
    gap: 8,
    // borderWidth: 1,
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  profilePicContainer: {
    width: 35,
    height: 35,
    margin: 5,
    marginRight: 8,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
    // fontFamily: "CaladeaRegular",
    color: "white",
  },
  imageContainer: {
    width: 50,
    height: 75,
    marginLeft: 0,
    // aspectRatio: 1,
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  postContent: {
    flex: 1,
  },
  action: {
    fontStyle: "italic",
    // borderWidth: 1,
    color: "white",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "red",
  },
  content: {
    // borderWidth: 1,
    alignItems: "center",
    fontSize: 16,
    color: "white",
  },
});
