import React from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
        <View style={styles.titleBar}>
          <FontAwesome name="gear" size={24} color="white" />
        </View>

        <View style={{ alignSelf: "center" }}>
          <View style={styles.profileImage}>
            <Image
              source={require("../assets/YishuDog.jpg")}
              style={styles.image}
              resizeMode="center"
            ></Image>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.text, { fontWeight: "400", fontSize: 36 }]}>
            Yishu C.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>15</Text>
            <Text style={[styles.text, styles.subText]}>Ranked</Text>
          </View>
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
            <Text style={[styles.text, { fontSize: 24 }]}>11</Text>
            <Text style={[styles.text, styles.subText]}>Friends</Text>
          </View>
          <View style={styles.statsBox}>
            <Text style={[styles.text, { fontSize: 24 }]}>8</Text>
            <Text style={[styles.text, styles.subText]}>Wishlist</Text>
          </View>
        </View>

        <View style={{ marginTop: 24 }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.mediaImageContainer}>
              <Image
                source={require("../assets/Alexa.png")}
                style={styles.image}
                resizeMode="cover"
              ></Image>
            </View>
            <View style={styles.mediaImageContainer}>
              <Image
                source={require("../assets/Alexa.png")}
                style={styles.image}
                resizeMode="cover"
              ></Image>
            </View>
            <View style={styles.mediaImageContainer}>
              <Image
                source={require("../assets/Alexa.png")}
                style={styles.image}
                resizeMode="cover"
              ></Image>
            </View>
          </ScrollView>
        </View>

        <Text style={[styles.subText, styles.recent]}>Recent Activity</Text>
        <ScrollView showsVerticalScrollIndicator={true}>
          <View style={styles.recentItemCard}>
            <View style={styles.activityIndicator}></View>
            <View style={{ width: 300 }}>
              <Text
                style={[styles.text, { color: "white", fontWeight: "300" }]}
              >
                Started following{" "}
                <Text style={{ fontWeight: "400" }}>Yishu C.</Text> and{" "}
                <Text style={{ fontWeight: "400" }}>Francis S.</Text>
              </Text>
            </View>
          </View>

          <View style={styles.recentItemCard}>
            <View style={styles.activityIndicator}></View>
            <View style={{ width: 300 }}>
              <Text
                style={[styles.text, { color: "white", fontWeight: "300" }]}
              >
                Started following{" "}
                <Text style={{ fontWeight: "400" }}>Yishu C.</Text> and{" "}
                <Text style={{ fontWeight: "400" }}>Francis S.</Text>
              </Text>
            </View>
          </View>

          <View style={styles.recentItemCard}>
            <View style={styles.activityIndicator}></View>
            <View style={{ width: 300 }}>
              <Text
                style={[styles.text, { color: "white", fontWeight: "300" }]}
              >
                Started following{" "}
                <Text style={{ fontWeight: "400" }}>Yishu C.</Text> and{" "}
                <Text style={{ fontWeight: "400" }}>Francis S.</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "HelveticaNeue",
    color: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
  },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: -32,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
  },
  infoContainer: {
    alignSelf: "center",
    alignItems: "center",
    marginTop: 12,
  },
  statsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 16,
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
    marginLeft: 24,
    marginTop: 32,
    marginBottom: 6,
    fontSize: 18,
  },
  recentItemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
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
});
