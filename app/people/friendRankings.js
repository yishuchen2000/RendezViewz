import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import supabase from "../../Supabase";
import Ranking from "../../components/friendRanking";
import FilterModal from "../../components/filterModal";
import FilterCell from "../../components/FilterCell";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function FriendRankings({ userId }) {
  const flatListRef = useRef();

  const [data, setData] = useState([]);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", userId);

      let sortedData = response.data.sort((a, b) => b.rating - a.rating);
      sortedData.forEach((item, index = 0) => {
        item.index = index + 1;
      });
      setData(sortedData);
    };
    fetchData();
  }, []);

  //create filter list
  const createFilterList = async () => {
    let response = await supabase
      .from("rankings")
      .select("*")
      .eq("user_id", userId);

    const genreSet = new Set();
    console.log(genreSet);

    response.data.forEach((item) => {
      item.genres.forEach((genre) => genreSet.add(genre));
    });

    if (Array.from(genreSet)) {
      setGenreList(Array.from(genreSet).sort());
    }
  };

  const filterByGenres = (data) => {
    let filteredData = data;
    if (selectedGenres.length > 0) {
      filteredData = data.filter((item) =>
        item.genres.some((genre) => selectedGenres.includes(genre))
      );
    }

    if (filteredData) {
      filteredData.sort((a, b) => b.rating - a.rating);
    }

    filteredData.forEach((item, index) => {
      item.index = index + 1;
    });
    return filteredData;
  };

  const removeGenre = (genreToRemove) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.genreBox}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedGenres.map((genre) => (
              <FilterCell
                key={genre}
                genre={genre}
                onPressRemove={() => removeGenre(genre)}
              />
            ))}
          </ScrollView>
        </View>
        <Pressable
          style={styles.filterButton}
          onPress={() => {
            setFilterModal(!filterModal);
            createFilterList();
          }}
        >
          <FontAwesome name="filter" size={18} color="#0E0111" />
          <Text style={{ color: "#0E0111" }}> Filters</Text>
        </Pressable>
        <FilterModal
          modalVisible={filterModal}
          setModalVisible={setFilterModal}
          genreList={genreList}
          exportGenres={setSelectedGenres}
        />
      </View>
      <FlatList
        ref={flatListRef}
        data={filterByGenres(data)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Ranking
            index={item.index}
            title={item.title}
            coverPic={item.url}
            rating={item.rating}
            goesTo={"FriendProfileRankingDetails"}
          />
        )}
        style={styles.rankList}
        contentContainerStyle={{
          paddingHorizontal: windowWidth * 0.02,
          paddingBottom: 80,
        }}
      />

      <View style={styles.buttonContainer}></View>
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
}

const styles = StyleSheet.create({
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  container: {
    paddingHorizontal: windowWidth * 0.02,
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: windowHeight * 0.05,
    paddingHorizontal: windowWidth * 0.02,
  },
  filterButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    gap: 3,
    marginLeft: "auto",
    backgroundColor: "#858AE3",
    // borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginVertical: 3,
    borderRadius: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
  genreBox: {
    flexDirection: "row",
    marginRight: 10,
    width: "72%",
  },
});
