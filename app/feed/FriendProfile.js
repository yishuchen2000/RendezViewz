import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import ProfilePost from "../../components/ProfilePost";
import { useNavigation } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";

import supabase from "../../Supabase";
import Ranking from "../../components/friendRanking";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function FriendProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    id,
    friendNumber,
    myPostData,
    profileData,
    rankedNumber,
    wishlistNumber,
  } = route.params;
  console.log("USER_IDin FriendProfile", id);
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0e0111", "#311866"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <View style={styles.centeredView}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: profileData[0].avatar_url,
                  }}
                  style={styles.profileImage}
                />
              </View>
            </View>

            <View style={styles.statsContainer}>
              <Pressable
                style={styles.statsBox}
                onPress={() =>
                  navigation.navigate("Friend Movies", {
                    screen: "Friend Rankings",
                    id: id,
                  })
                }
              >
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {rankedNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Ranked</Text>
                </View>
              </Pressable>
              <Text style={[styles.text, { fontWeight: "400", fontSize: 28 }]}>
                {profileData[0].username}
              </Text>
              <View style={[styles.statsBox, {}]}>
                <Pressable style={[styles.statsBox]}>
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {friendNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Friends</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Text style={[styles.subText, styles.recent]}>About</Text>
          <View style={styles.rectangleContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.rectangleText}>{profileData[0].info}</Text>
            </View>
            <View style={styles.centerContainer}>
              <View style={styles.rectangleLine} />
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.wishlistInfo}>
                <Pressable
                  style={styles.statsBox}
                  onPress={() =>
                    navigation.navigate("Friend Movies", {
                      screen: "Friend Wishlist",
                      id: id,
                    })
                  }
                >
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {wishlistNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Wishlist</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.postBar}>
              <Text style={[styles.subText, styles.recent]}>Posts</Text>
              {myPostData.map((item) => (
                <ProfilePost
                  profileData={profileData}
                  key={item.id}
                  id={item.id}
                  user={item.user}
                  timestamp={item.created_at}
                  text={item.text}
                  liked={item.liked}
                  imageUrl={item.show_poster_url}
                  profilePic={item.profile_pic}
                  action={item.action}
                  comments={item.comments}
                  title={item.movie_title}
                  goesTo={"ShowDetails"}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderColor: "red",
    flex: 0.5,
  },
  info: {
    borderColor: "green",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBotton: 20,
  },
  followButtonText: {
    color: "#0E0111",
    fontWeight: "bold",
    fontSize: 18,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: "#858AE3",
    width: 120,
    marginRight: 20,
  },
  messageButton: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#97DFFC",
    width: 120,
    marginLeft: 20,
  },
  messageButtonText: {
    color: "#97DFFC",
    fontWeight: "bold",
    fontSize: 18,
  },
  rectangleContainer: {
    marginTop: 10,
    backgroundColor: "#97DFFC33",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    height: 120,
  },
  leftContainer: {
    flex: 2,
    justifyContent: "center",
    paddingLeft: 10,
  },
  centerContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 5,
    paddingRight: 10,
  },
  rectangleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  rectangleLine: {
    width: 3,
    backgroundColor: "#858AE3",
    height: "80%",
    alignSelf: "center",
  },
  wishlistInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postBar: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  text: {
    color: "white",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 0.32,
  },
  linearGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  profileImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 6,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
    marginTop: 20,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  subText: {
    paddingTop: 10,
    fontSize: 12,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  recent: {
    marginLeft: 12,
    marginTop: 5,
    marginBottom: 6,
    fontSize: 18,
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
});
