import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  LayoutAnimation,
  Alert,
  Switch,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { debounce } from "lodash";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import supabase from "../../Supabase";
import getMovieDetails from "../../components/getMovieDetails";
import searchByTitle from "../../components/searchByTitle";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

const AddRanking = () => {
  const navigation = useNavigation();
  const [entry, setEntry] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectionChosen, setSelectionChosen] = useState(false);
  const [rankValue, setRankValue] = useState(5);
  const [sliderDisplayValue, setSliderDisplayValue] = useState(
    rankValue.toString()
  );
  const [modalValid, setModalValid] = useState(false);
  const [session, setSession] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);

        const fetchRankings = async () => {
          try {
            const rankingsList = await supabase
              .from("rankings")
              .select("*")
              .eq("user_id", session.user.id);

            if (Array.isArray(rankingsList.data)) {
              const sortedData = rankingsList.data.sort(
                (a, b) => b.rating - a.rating
              );
              sortedData.forEach((item, index = 0) => {
                item.index = index + 1;
              });
              setRankings(sortedData);
            }
          } catch {
            console.error("Failed to fetch rankings:", error);
          }
        };
        fetchRankings();
      }
    });
  }, [rankings]);

  useEffect(() => {
    setModalValid(selectionChosen);
  }, [selectionChosen]);

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query) {
        const results = await searchByTitle(query.trim());
        setSuggestions(results);
        setVisibleSuggestions(true);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    if (entry && !selectionChosen) {
      setVisibleSuggestions(false);
      fetchSuggestions(entry);
    } else {
      setSuggestions([]);
    }

    return () => fetchSuggestions.cancel();
  }, [entry, fetchSuggestions]);

  const sliderDisplaySubmit = (e) => {
    const submittedValue = parseFloat(e.nativeEvent.text);
    if (!isNaN(submittedValue) && submittedValue >= 0 && submittedValue <= 10) {
      setRankValue(submittedValue);
      setSliderDisplayValue(submittedValue.toString());
    } else if (submittedValue > 10) {
      setRankValue(10);
      setSliderDisplayValue("10");
    } else if (submittedValue < 0) {
      setRankValue(0);
      setSliderDisplayValue("0");
    } else {
      setSliderDisplayValue(rankValue.toString());
    }
  };

  const handleRank = async () => {
    setLoading(true);
    const movieDetails = await getMovieDetails(entry);

    if (!movieDetails || movieDetails.Response === "False") {
      Alert.alert("Invalid Title", "Please enter a valid movie or show title.");
      setLoading(false);
      return;
    }

    const existingEntry = rankings.find((item) => item.title === entry);

    if (existingEntry) {
      // Update existing entry
      const { data: updatedData, error } = await supabase
        .from("rankings")
        .update({
          title: movieDetails.Title,
          url: movieDetails.Poster,
          rating: parseFloat(rankValue),
          genres: movieDetails.Genre,
        })
        .eq("id", existingEntry.id);

      if (error) {
        console.error("Failed to update ranking:", error);
        Alert.alert("Error", "Failed to update ranking. Please try again.");
        setLoading(false);
        return;
      }

      if (commentsEnabled) {
        const postData = {
          id: Date.now(),
          text: comments,
          liked: false,
          comments: [],
          movie_title: movieDetails.Title,
          user_id: session.user.id,
          action: `Updated ranking of this to ${parseFloat(rankValue)}/10`,
          created_at: new Date(),
        };

        const { data: newPost, error: postError } = await supabase
          .from("posts")
          .insert([postData]);

        if (postError) {
          console.error("Failed to create post:", postError);
          Alert.alert("Error", "Failed to create post. Please try again.");
          setLoading(false);
          return;
        }
      }

      let response = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", session.user.id);

      if (response) {
        let newSortedData = response.data.sort((a, b) => b.rating - a.rating);

        newSortedData.forEach((item, index = 0) => {
          item.index = index + 1;
        });

        setRankings(newSortedData);
        navigation.navigate("Rankings");
      }
    } else {
      // Insert new entry
      const newId = Date.now();

      const { data: upsertedData, error } = await supabase
        .from("rankings")
        .upsert([
          {
            id: newId,
            title: movieDetails.Title,
            index: 0,
            url: movieDetails.Poster,
            rating: parseFloat(rankValue),
            genres: movieDetails.Genre,
            user_id: session.user.id,
          },
        ]);

      if (error) {
        console.error("Failed to insert ranking:", error);
        Alert.alert("Error", "Failed to insert ranking. Please try again.");
        setLoading(false);
        return;
      }

      const postData = {
        id: newId,
        text: commentsEnabled ? comments : "",
        liked: false,
        comments: [],
        movie_title: movieDetails.Title,
        user_id: session.user.id,
        action: `Gave this a ${parseFloat(rankValue)}/10`,
        created_at: new Date(),
      };

      if (commentsEnabled) {
        const { data: newPost, error: postError } = await supabase
          .from("posts")
          .upsert([postData]);

        if (postError) {
          console.error("Failed to create post:", postError);
          Alert.alert("Error", "Failed to create post. Please try again.");
          setLoading(false);
          return;
        }
      }

      let response = await supabase
        .from("rankings")
        .select("*")
        .eq("user_id", session.user.id);

      if (response) {
        let newSortedData = response.data.sort((a, b) => b.rating - a.rating);

        newSortedData.forEach((item, index = 0) => {
          item.index = index + 1;
        });

        setRankings(newSortedData);
        navigation.navigate("Rankings");
      }
    }
    setLoading(false);
    setTimeout(() => setLoading(false), 3000);
  };

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [visibleSuggestions]);

  return (
    <LinearGradient
      colors={["#0e0111", "#311866"]}
      style={styles.container}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === "ios" ? 150 : 200}
      >
        <View style={styles.header}>
          <Text style={styles.modalTitle}>Add Content</Text>
          <Image style={styles.underline} source={UNDERLINE} />
        </View>

        <View style={styles.questionsContainer}>
          <View style={styles.titleSelectContainer}>
            <Text style={styles.titleQuestion}>Enter Title:</Text>
            <View style={styles.titleTextBar}>
              <TextInput
                style={[
                  styles.titleDropdown,
                  { color: selectionChosen ? "white" : "white" },
                ]}
                placeholder="Enter a movie or show title..."
                placeholderTextColor="rgba(255, 255, 255, 0.8)"
                value={
                  (entry ? entry : "") +
                  (selectedYear ? ` (${selectedYear})` : "")
                }
                onChangeText={(text) => {
                  setEntry(text);
                  setSelectedYear("");
                  setSelectionChosen(false);
                }}
              />
              {entry && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    setEntry("");
                    setSelectedYear("");
                    setSelectionChosen(false);
                    setSuggestions([]);
                    setVisibleSuggestions(false);
                  }}
                >
                  <MaterialIcons
                    name="cancel"
                    size={25}
                    color={"white"}
                    style={styles.clearButton}
                  />
                </Pressable>
              )}
            </View>
          </View>
          <View style={styles.sharedContainer}>
            {visibleSuggestions ? (
              suggestions.length > 0 ? (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.imdbID}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setEntry(item.Title);
                        setSelectedYear(item.Year);
                        setSuggestions([]);
                        setVisibleSuggestions(false);
                        setSelectionChosen(true);
                      }}
                    >
                      <Image
                        source={
                          item.Poster !== "N/A"
                            ? { uri: item.Poster }
                            : require("../../assets/blankPoster.png")
                        }
                        style={styles.posterImage}
                      />
                      <View style={styles.suggestionText}>
                        <Text numberOfLines={1} style={styles.titleText}>
                          {item.Title}
                        </Text>
                        <Text style={styles.yearText}>({item.Year})</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 200 }}
                />
              ) : entry !== null && entry.trim() !== "" ? (
                <View style={styles.noSuggestionsContainer}>
                  <View style={styles.noSuggestionsTextContainer}>
                    <Text style={styles.noSuggestionsText}>
                      No movies or TV shows match that title.
                    </Text>
                  </View>
                </View>
              ) : null
            ) : (
              <>
                <Text style={styles.titleQuestion}>Your Rating:</Text>
                <View style={styles.slider}>
                  <TextInput
                    style={styles.sliderDisplay}
                    keyboardType="numeric"
                    onSubmitEditing={sliderDisplaySubmit}
                    onBlur={(e) => sliderDisplaySubmit(e)}
                    returnKeyType="done"
                    onChangeText={(text) => setSliderDisplayValue(text)}
                    value={sliderDisplayValue}
                  ></TextInput>
                  <Slider
                    style={{ width: windowWidth * 0.65, height: 40 }}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    minimumTrackTintColor="#858AE3"
                    maximumTrackTintColor="grey"
                    value={rankValue * 10}
                    onValueChange={(value) => {
                      const newValue = value / 10;
                      setRankValue(newValue);
                      setSliderDisplayValue(newValue.toFixed(1));
                    }}
                  />
                </View>
              </>
            )}
          </View>
        </View>

        <View style={styles.commentToggleContainer}>
          <Text style={styles.commentToggleLabel}>Create a Public Post</Text>
          <Switch
            value={commentsEnabled}
            onValueChange={setCommentsEnabled}
            trackColor={{ false: "#767577", true: "#858AE3" }}
            thumbColor={commentsEnabled ? "#white" : "#f4f3f4"}
          />
        </View>

        {commentsEnabled && (
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="What did you think?"
              placeholderTextColor="lightgray"
              value={comments}
              onChangeText={setComments}
            />
          </View>
        )}

        <View style={styles.bottom}>
          <Pressable
            style={[
              styles.addButton,
              { backgroundColor: modalValid ? "#858AE3" : "gray" },
            ]}
            onPress={handleRank}
            disabled={!modalValid || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  color: modalValid ? "white" : "#0E0111",
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Update Ranking
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.clapboard}>
        <Image
          source={require("../../assets/Clapboard2.png")}
          style={{ flex: 1, width: windowWidth, resizeMode: "stretch" }}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingBottom: windowHeight * 0.3,
  },
  header: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 30,
    color: "white",
    textAlign: "center",
  },
  underline: {
    transform: [{ scaleX: -1 }, { rotate: "4deg" }],
    alignSelf: "center",
    width: "70%",
    height: 90,
    tintColor: "#858AE3",
  },
  questionsContainer: {
    paddingTop: 15,
    paddingBottom: 5,
  },
  titleSelectContainer: {
    width: "100%",
    gap: 8,
  },
  titleQuestion: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 17,
  },
  titleTextBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingLeft: 15,
    paddingRight: 5,
    margin: 10,
    backgroundColor: "rgba(133, 138, 227, 0.50)",
    borderColor: "#858AE3",
    borderWeight: 10,
    height: 55,
    borderRadius: 15,
    borderWidth: 0.5,
  },
  titleDropdown: {
    flex: 1,
    color: "white",
  },
  clearButton: {
    marginLeft: 10,
    marginRight: 0,
    padding: 0,
  },
  clearButtonText: {
    color: "darkgray",
    fontSize: 20,
  },
  sharedContainer: {
    height: 200,
    marginLeft: 10,
    width: "90%",
    gap: 30,
    justifyContent: "center",
  },
  suggestionsContainer: {
    maxHeight: 200,
    width: "80%",
    position: "absolute",
    top: "100%",
    zIndex: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  posterImage: {
    height: 60,
    width: 35,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "grey",
  },
  suggestionItem: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    marginLeft: 15,
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingBottom: 2,
    color: "white",
  },
  yearText: {
    color: "lightgrey",
  },
  noSuggestionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  noSuggestionsTextContainer: {
    justifyContent: "center",
    width: windowWidth * 0.5,
  },
  noSuggestionsText: {
    textAlign: "center",
    fontSize: 20,
    color: "gray",
  },
  slider: {
    alignItems: "center",
    marginLeft: 10,
    gap: 10,
  },
  sliderDisplay: {
    padding: 10,
    fontSize: 28,
    color: "white",
    borderWidth: 3,
    borderColor: "#858AE3",
    borderRadius: 15,
    width: windowWidth * 0.2,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "rgba(133, 138, 227, 0.50)",
  },
  bottom: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  addButton: {
    alignSelf: "center",
    width: 190,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  commentToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  commentToggleLabel: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  commentInputContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  commentInput: {
    height: 100,
    backgroundColor: "rgba(133, 138, 227, 0.50)",
    borderColor: "#858AE3",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    textAlignVertical: "top",
    color: "white",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
});

export default AddRanking;
