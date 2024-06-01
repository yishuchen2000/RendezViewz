import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import supabase from "../../Supabase";
import Ranking from "../../components/Ranking";
import FilterModal from "../../components/filterModal";
import FilterCell from "../../components/FilterCell";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Rankings() {
  const navigation = useNavigation();
  const flatListRef = useRef();

  const [filterModal, setFilterModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        fetchRankings(session);
      }
    };
    fetchSession();

    const subscription = supabase
      .channel("public:rankings")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rankings" },
        (payload) => {
          fetchSession();
          handleRankingChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchRankings = async (session) => {
    try {
      const { data: rankingsList } = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", session.user.id);

      const sortedData = rankingsList.sort((a, b) => b.rating - a.rating);
      sortedData.forEach((item, index) => (item.index = index + 1));
      setRankings(sortedData);
    } catch (error) {
      console.error("Failed to fetch rankings:", error);
    }
  };

  const handleRankingChange = async (payload) => {
    if (!session) {
      //There should always be a session, and it keeps falling in here right now
      return;
    }
    try {
      const { data: rankingsList } = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", session.user.id);

      const sortedData = rankingsList.sort((a, b) => b.rating - a.rating);
      sortedData.forEach((item, index) => (item.index = index + 1));
      setRankings(sortedData);

      LayoutAnimation.configureNext(layoutAnimConfig);
    } catch (error) {
      console.error("Failed to handle ranking change:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from("rankings").delete().eq("id", id);

      const { data: response } = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", session.user.id);

      const sortedData = response.sort((a, b) => b.rating - a.rating);
      sortedData.forEach((item, index) => (item.index = index + 1));
      setRankings(sortedData);

      LayoutAnimation.configureNext(layoutAnimConfig);
    } catch (error) {
      console.error("Failed to delete ranking:", error);
    }
  };

  const createFilterList = async () => {
    try {
      const { data: response } = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", session.user.id);

      const genreSet = new Set();
      response.forEach((item) =>
        item.genres.forEach((genre) => genreSet.add(genre))
      );
      setGenreList(Array.from(genreSet).sort());
    } catch (error) {
      console.error("Failed to create filter list:", error);
    }
  };

  const filterByGenres = (rankings) => {
    let filteredData = rankings;
    if (selectedGenres.length > 0) {
      filteredData = rankings.filter((item) =>
        item.genres.some((genre) => selectedGenres.includes(genre))
      );
    }
    filteredData.sort((a, b) => b.rating - a.rating);
    filteredData.forEach((item, index) => (item.index = index + 1));
    return filteredData;
  };

  const removeGenre = (genreToRemove) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.filter((genre) => genre !== genreToRemove)
    );
  };

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

  if (!rankings) {
    return (
      <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
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
        data={filterByGenres(rankings)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Ranking
            index={item.index}
            title={item.title}
            coverPic={item.url}
            onDelete={() => handleDelete(item.id)}
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
            navigation.navigate("Add Ranking");
          }}
        >
          <AntDesign name="pluscircle" size={60} color="#602683" />
        </Pressable>
      </View>
      <View style={styles.clapboard}>
        <Image
          source={require("../../assets/Clapboard2.png")}
          style={{ flex: 1, width: windowWidth, resizeMode: "stretch" }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 200,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
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
