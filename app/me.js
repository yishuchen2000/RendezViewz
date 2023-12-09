import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import ProfilePost from "../components/ProfilePost";
//import Rankings from "./rankings/rankings";
import { useNavigation } from "@react-navigation/native";
import MyTabs from "./rankings/_layout";
//import MyTabs from "./rankings";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Me() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#361866", "#E29292"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <View style={styles.header}>
          <View style={styles.titleBar}>
            <FontAwesome name="gear" size={24} color="white" />
          </View>

          <View style={styles.profileImage}>
            <Image
              source={{
                uri: "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/public/rendezviewz/people/me.png",
              }}
              style={styles.image}
            ></Image>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.text, { fontWeight: "400", fontSize: 28 }]}>
              Yishu C.
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <Pressable
              style={styles.statsBox}
              onPress={() => navigation.navigate("rankings")}
            >
              <View style={styles.statsBox}>
                <Text style={[styles.text, { fontSize: 18 }]}>15</Text>
                <Text style={[styles.text, styles.subText]}>Ranked</Text>
              </View>
            </Pressable>

            <View
              style={[
                styles.statsBox,
                {
                  borderColor: "white",
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                },
              ]}
            >
              <Pressable
                style={[styles.statsBox]}
                onPress={() => navigation.navigate("people")}
              >
                <Text style={[styles.text, { fontSize: 18 }]}>11</Text>
                <Text style={[styles.text, styles.subText]}>Friends</Text>
              </Pressable>
            </View>

            <View style={styles.statsBox}>
              <Pressable
                style={styles.statsBox}
                onPress={() =>
                  navigation.navigate("rankings", { screen: "My Wishlist" })
                }
              >
                <Text style={[styles.text, { fontSize: 18 }]}>8</Text>
                <Text style={[styles.text, styles.subText]}>Wishlist</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.postBar}>
            <Text style={[styles.subText, styles.recent]}>My posts</Text>
            {/* <View style={styles.scroll}> */}
            <ScrollView style={styles.scroll} horizontal={false}>
              <View>
                <ProfilePost
                  id={1}
                  user={"Yishu C."}
                  timestamp={"now"}
                  text={"Anything with Margot Robbie hitsss"}
                  liked={false}
                  imageSource={require("../assets/barbieposter.jpg")}
                  profilePic={require("../assets/YishuDog.jpg")}
                  action={'Ranked "Barbie" #2'}
                  // comments={item.comments}
                />
                <ProfilePost
                  id={1}
                  user={"Yishu C."}
                  timestamp={"2h "}
                  text={"I can't believe Rachel"}
                  liked={false}
                  imageSource={require("../assets/friendsposter.jpeg")}
                  profilePic={require("../assets/YishuDog.jpg")}
                  action={'Now on episode 6 of "Friends"'}
                  // comments={item.comments}
                />
              </View>
            </ScrollView>
            {/* </View> */}
          </View>

          <View style={styles.activityBar}>
            <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>

            <ScrollView
              style={styles.scroll}
              showsVerticalScrollIndicator={true}
            >
              <View style={styles.recentItemCard}>
                {/* <View style={styles.activityIndicator}></View> */}
                <View style={{ width: 300 }}>
                  <Text
                    style={[styles.text, { color: "white", fontWeight: "300" }]}
                  >
                    Now friends with{" "}
                    <Text style={styles.boldName}>Allen N.</Text>,{" "}
                    <Text style={styles.boldName}>Francis S.</Text>,{" "}
                    <Text style={styles.boldName}>+1 more</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.recentItemCard}>
                <View style={styles.activityIndicator}></View>
                <View style={{ width: 300 }}>
                  <Text
                    style={[styles.text, { color: "white", fontWeight: "300" }]}
                  >
                    <Text style={styles.boldName}>Zach</Text> is inviting you to
                    watch <Text style={styles.boldName}>Black Mirror</Text>
                  </Text>
                </View>
              </View>

              <View style={styles.recentItemCard}>
                <View style={styles.activityIndicator}></View>
                <View style={{ width: 300 }}>
                  <Text
                    style={[styles.text, { color: "white", fontWeight: "300" }]}
                  >
                    <Text style={styles.boldName}>Charlotte Z.</Text> liked your
                    post
                  </Text>
                </View>
              </View>

              <View style={styles.recentItemCard}>
                <View style={styles.activityIndicator}></View>
                <View style={{ width: 300 }}>
                  <Text
                    style={[styles.text, { color: "white", fontWeight: "300" }]}
                  >
                    <Text style={styles.boldName}>Alexa</Text> is inviting you
                    to watch <Text style={styles.boldName}>Invincible</Text>
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        <View style={styles.clapboard}>
          <Image
            source={require("../assets/Clapboard2.png")}
            style={{
              flex: 1,
              width: windowWidth,
              resizeMode: "stretch",
            }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderColor: "red",
    flex: 0.7,
  },
  info: {
    borderColor: "green",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postBar: {
    flex: 1,
  },
  activityBar: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  text: {
    color: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
  },
  new: {
    alignItems: "center",
  },
  image: {
    flex: 1,
    // resizeMode: "contain",
    // width: 100,
    // height: 100,
    maxWidth: "100%", // Maximum width as the container's width
    maxHeight: "100%", // Maximum height as the container's height
    resizeMode: "contain",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    // marginTop: 24,
    // marginHorizontal: 16,
    // marginBottom: -32,
    // borderWidth: 1,
    flex: 0.32,
  },
  profileImage: {
    // width: 150,
    // height: 150,
    // borderRadius: 100,
    flex: 1,
    // padding: 10,
    overflow: "hidden",
    // alignItems: "center",
    justifyContent: "center",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 12,
    flex: 0.3,
  },
  statsContainer: {
    flexDirection: "row",
    // alignSelf: "center",
    // marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  subText: {
    fontSize: 12,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  mediaImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  recent: {
    marginLeft: 12,
    marginTop: 5,
    marginBottom: 6,
    fontSize: 18,
  },
  recentItemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    // flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
  },
  activityIndicator: {
    backgroundColor: "white",
    padding: 4,
    height: 12,
    width: 12,
    borderRadius: 6,
    marginTop: 3,
    marginRight: 20,
  },
  boldName: {
    fontWeight: "500",
  },
  clapboard: {
    // position: "abolute",
    // bottom: windowHeight * 0.015,
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
});
