import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  LayoutAnimation,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import supabase from "../../Supabase";
import Ranking from "../../components/Ranking";
import FilterModal from "../../components/filterModal";
import FilterCell from "../../components/FilterCell";
import getMovieDetails from "../../components/getMovieDetails";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function Rankings() {
  const navigation = useNavigation();

  const [isDuplicateEntry, setIsDuplicateEntry] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [data, setData] = useState([]);
  const [entry, setEntry] = useState(null);
  const [rankValue, setRankValue] = useState(5);
  const [rankCount, setRankCount] = useState(null);
  const [modalValid, setModalValid] = useState(false);
  const [renderSwitch, flipRenderSwitch] = useState(false);
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("rankings").select("*");
      const sortedData = response.data.sort((a, b) => b.rating - a.rating);

      sortedData.forEach((item, index = 0) => {
        item.index = index + 1;
      });

      setData(sortedData);
      setRankCount(response.data.length);
    };
    fetchData();
  }, [renderSwitch, entry]);

  useEffect(() => {
    if (entry && rankValue <= 10 && rankValue >= 0) {
      const isDuplicate = data.some((item) => item.title === entry);
      setIsDuplicateEntry(isDuplicate);
      setModalValid(true);
    } else {
      setIsDuplicateEntry(false);
      setModalValid(false);
    }
  }, [entry, rankValue, data]);

  const handleRank = async () => {
    setModalVisible(!modalVisible); //close modal
    const movieDetails = await getMovieDetails(entry);

    if (!movieDetails || movieDetails.Response === "False") {
      Alert.alert("Invalid Title", "Please enter a valid movie or show title.");
      return;
    }

    if (isDuplicateEntry) {
      Alert.alert(`${entry} is already ranked on this list.`);
      return;
    }

    newId = Date.now();

    const { data } = await supabase.from("rankings").upsert([
      {
        id: newId,
        title: movieDetails.Title,
        index: 0,
        url: movieDetails.Poster,
        rating: parseFloat(rankValue),
        genres: movieDetails.Genre,
      },
    ]);

    let response = await supabase.from("rankings").select("*");
    let sortedData = response.data.sort((a, b) => b.rating - a.rating);

    sortedData.forEach((item, index = 0) => {
      item.index = index + 1;
    });

    await supabase.from("rankings").upsert(sortedData);
    flipRenderSwitch(!renderSwitch);
    setRankValue(5);
  };

  //Animation for delete
  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleDelete = async (id, index) => {
    await supabase.from("rankings").delete().eq("id", id);

    let response = await supabase.from("rankings").select("*");
    sortedData = response.data.sort((a, b) => b.rating - a.rating);

    sortedData.forEach((item, index = 0) => {
      item.index = index + 1;
    });
    await supabase.from("rankings").upsert(sortedData);

    setData(sortedData);
    LayoutAnimation.configureNext(layoutAnimConfig);
    setRankCount(sortedData.length);
  };

  //for rating slider in modal
  const debouncedSetRankValue = debounce((value) => {
    setRankValue(value / 10);
  }, 100);

  //create filter list
  const createFilterList = async () => {
    let response = await supabase.from("rankings").select("*");

    const genreSet = new Set();

    response.data.forEach((item) => {
      item.genres.forEach((genre) => genreSet.add(genre));
    });

    setGenreList(Array.from(genreSet).sort());
    console.log(genreList);
  };

  const filterByGenres = (data) => {
    let filteredData = data;
    if (selectedGenres.length > 0) {
      filteredData = data.filter((item) =>
        item.genres.some((genre) => selectedGenres.includes(genre))
      );
    }

    filteredData.sort((a, b) => b.rating - a.rating);

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

  //loading icon
  if (!data) {
    return (
      <LinearGradient
        colors={["#361866", "#E29292"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="purple" />
          <Text style={{ color: "white" }}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#361866", "#E29292"]}
      style={styles.container}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Content</Text>
              <Image style={styles.underline} source={UNDERLINE} />
              <Pressable
                style={styles.buttonCloseContainer}
                onPress={() => setModalVisible(!modalVisible) & setRankValue(5)}
              >
                <View style={styles.buttonClose}>
                  <MaterialIcons name="cancel" size={30} color={"black"} />
                </View>
              </Pressable>
            </View>

            <View style={styles.questionsContainer}>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Enter Title:</Text>
                <TextInput
                  style={styles.titleDropdown}
                  placeholder="Enter a movie or show title..."
                  placeholderTextColor="gray"
                  value={entry}
                  onChangeText={(text) => {
                    setEntry(text);
                  }}
                />
              </View>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Your Rating:</Text>
                <View style={styles.slider}>
                  <Slider
                    style={{ width: windowWidth * 0.7, height: 40 }}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    minimumTrackTintColor="purple"
                    maximumTrackTintColor="grey"
                    value={50}
                    onValueChange={(value) => debouncedSetRankValue(value)}
                  />
                  <Text style={styles.sliderDisplay}>{rankValue}</Text>
                </View>
              </View>
            </View>

            <View style={styles.bottom}>
              <Pressable
                style={[
                  styles.addButton,
                  { backgroundColor: modalValid ? "#602683" : "gray" },
                ]}
                onPress={handleRank}
                disabled={!modalValid}
              >
                <Text
                  style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
                >
                  Update Ranking
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
          <FontAwesome name="filter" size={18} color="white" />
          <Text style={{ color: "white" }}> Filters</Text>
        </Pressable>
        <FilterModal
          modalVisible={filterModal}
          setModalVisible={setFilterModal}
          genreList={genreList}
          exportGenres={setSelectedGenres}
        />
      </View>

      <FlatList
        data={filterByGenres(data)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Ranking
            index={item.index}
            title={item.title}
            coverPic={item.url}
            onDelete={() => handleDelete(item.id, item.index)}
            rating={item.rating}
            goesTo={"Ranking Details"}
          />
        )}
        style={styles.rankList}
        contentContainerStyle={{
          paddingHorizontal: windowWidth * 0.02,
          paddingBottom: 80,
        }}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.plusButton}
          onPress={() => {
            setModalVisible(!modalVisible);
            setEntry(null);
          }}
        >
          <AntDesign name="pluscircle" size={60} color="#602683" />
        </Pressable>
      </View>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: windowHeight * 0.2,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.05,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  plusButton: {
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: windowWidth * 0.8,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#361866",
  },
  modalHeader: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    justifyContent: "space-between",
    paddingBottom: 42,
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  modalTitle: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 30,
    color: "#361866",
    textAlign: "center",
  },
  underline: {
    transform: [{ scaleX: -1 }, { rotate: "4deg" }],
    alignSelf: "center",
    position: "absolute",
    top: 45,
    left: 48,
    width: "70%",
    height: 90,
    tintColor: "#361866",
  },
  buttonCloseContainer: {
    position: "absolute",
    color: "white",
    padding: 5,
    width: 80,
    height: 50,
  },
  questionsContainer: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  titleSelectContainer: {
    width: "100%",
    gap: 8,
    marginBottom: 30,
  },
  titleQuestion: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#361866",
    marginLeft: 17,
  },
  titleDropdown: {
    marginHorizontal: 20,
    paddingLeft: 15,
    backgroundColor: "lavender",
    color: "purple",
    height: 60,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  slider: {
    alignItems: "center",
  },
  sliderDisplay: {
    paddingTop: 10,
    fontSize: 28,
    color: "purple",
  },
  selectedTextStyle: {
    color: "#602683",
    marginRight: 5,
    fontSize: 16,
    alignSelf: "center",
  },
  rankingInput: {
    marginHorizontal: 20,
    paddingLeft: 15,
    backgroundColor: "lavender",
    color: "#602683",
    height: 50,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  bottom: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  addButton: {
    alignSelf: "center",
    width: 190,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  filterContainer: {
    backgroundColor: "#361866",
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
    backgroundColor: "#361866",
    borderColor: "white",
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
  container: {
    flex: 1,
  },
});
