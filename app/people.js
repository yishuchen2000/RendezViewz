import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Friend from "../components/Friend";
import supabase from "../Supabase";
import { Entypo } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import filter from "lodash.filter";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Page() {
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("friends").select("*");
      setData(response.data);
      setFilteredData(response.data);
    };
    fetchData();
  }, []);

  // const handleSearch = async () => {
  //   // create a drop down and return friend that matches
  //   // after selection of the friend clear up the input
  //   setDisplaySearch(true);
  //   const response = await supabase.from("friends").select("*");
  //   setData(response.data);
  // };

  const clearSearch = async () => {
    setFilteredData(data);
    setSearchQuery("");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(data, ({ id, profile_pic, user }) => {
      console.log("formattedQuery", formattedQuery);
      // console.log(contains({ id, profile_pic, user }, formattedQuery));
      return contains({ id, profile_pic, user }, formattedQuery);
    });
    console.log("filteredData", filteredData);
    setFilteredData(filteredData);
  };

  const contains = ({ id, profile_pic, user }, query) => {
    console.log("current user!", user);
    console.log("current query", query);

    if (user.toLowerCase().includes(query)) {
      return true;
    }
    return false;
  };

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.container1}>
        <View style={styles.input}></View>

        <View style={styles.searchBar}>
          <TextInput
            numberOfLines={1}
            style={{ color: "black", textAlign: "left" }}
            placeholder="Search friend"
            placeholderTextColor="gray"
            // value={searchInput}
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
          />

          <View style={styles.buttons}>
            <Pressable onPress={clearSearch} style={styles.searchbutton}>
              <View style={styles.searchbutton}>
                <Entypo name="cross" size={24} color="gray" />
              </View>
            </Pressable>
            <Pressable onPress={handleSearch} style={styles.searchbutton}>
              <View style={styles.searchbutton}>
                <FontAwesome
                  name="search"
                  size={18}
                  color="rgba(150, 130, 200, 1)"
                />
              </View>
            </Pressable>
          </View>
        </View>

        <View style={styles.friendList}>
          {/* <Text style={styles.title}>Add</Text> */}
          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <View style={styles.friendbox}>
                <Friend
                  id={item.id}
                  user={item.user}
                  profilePic={item.profile_pic}
                />
              </View>
            )}
            keyExtractor={(item) => item.text}
            style={styles.posts}
          />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // justifyContent: "space-between",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
    paddingTop: 10,
    borderWidth: 1,
  },
  container1: {
    // paddingTop: 10,
    backgroundColor: "transparent",
    // borderWidth: 1,
    flex: 1,
  },
  friendbox: {
    backgroundColor: "rgba(50, 50, 50, 0.1)",
    // borderWidth: 1,
  },
  friendList: {
    backgroundColor: "transpar",
    flex: 8,
    borderWidth: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.13,
  },
  searchbutton: {
    alignItems: "center",
    justifyContent: "center",
    //borderColor: "red",
    //borderWidth: 5,
  },
  searchBar: {
    // flex: 1,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  main: {
    height: windowHeight * 0.5,
    width: windowWidth,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",
    borderWidth: 5,
    borderColor: "green",
    alignItems: "center",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  clapboard: {
    // position: "absolute",
    // flex: 0.04,
    // bottom: windowHeight * 0.04,
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  posts: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});
