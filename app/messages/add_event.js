import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  Keyboard,
  Alert,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { debounce } from "lodash";
import {
  Ionicons,
  MaterialIcons,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import DatePicker from "react-native-modern-datepicker";
import MultiSelect from "react-native-multiple-select";
import CustomModal from "./custommodal";
import getMovieDetails from "../../components/getMovieDetails";
import searchByTitle from "../../components/searchByTitle";
import dayjs from "dayjs";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const AddEvent = ({ route, navigation }) => {
  // data initially used by Yishu
  const [show, setShow] = useState(null);
  const [poster, setPoster] = useState(null);
  const [person, setPerson] = useState([]);
  const [personValue, setPersonValue] = useState([]);
  const [allSelected, setAllSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState(dayjs().format("HH:mm"));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickeddate, setpickeddate] = useState(true);
  const [pickedtime, setpickedtime] = useState(true);
  const [text, setText] = useState(dayjs().format("YYYY-MM-DD"));
  const [textT, setTextT] = useState(dayjs().format("HH:mm"));
  const [modalVisible, setModalVisible] = useState(false);
  const [modalon, setModalon] = useState(false);
  const [Plist, setPlist] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectionChosen, setSelectionChosen] = useState(false);

  // variables added by Char
  const [session, setSession] = useState(null);
  const [friendIDs, setFriendIDs] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const fetchFriendID = async () => {
        const friends = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id);

        if (friends.error) {
          throw new Error(friends.error.message);
        }
        const updatedFriendIds = friends.data[0].friend_ids.filter(
          (friendId) => friendId !== session.user.id
        );
        setFriendIDs(updatedFriendIds);
      };
      fetchFriendID();
    });
  }, []);

  useEffect(() => {
    if (friendIDs) {
      // console.log("TYPE", typeof friendIDs);
      const fetchFriends = async () => {
        // console.log("searching matched friends!");
        const response = await supabase
          .from("profiles")
          .select("*")
          .in("id", friendIDs);

        if (response.error) {
          throw new Error(response.error.message);
        }
        const peopleData = response.data.map((person) => ({
          label: person.username,
          value: person.id.toString(),
          photo: person.avatar_url,
        }));
        setPlist(peopleData);
      };
      fetchFriends();
    }
  }, [friendIDs]);

  useEffect(() => {
    setDate(dayjs().format("YYYY/MM/DD"));
    setTime(dayjs().format("HH:mm"));
  }, []);

  function handleOnPressOpen() {
    setOpen(!open);
    setModalon(!modalon);
  }

  function handleChange(selectedDate) {
    setDate(selectedDate);
  }

  function handleChange1(date) {
    setText(date);
    setpickeddate(false);
    setOpen(!open);
    setModalon(!modalon);
  }

  function handleTimePickerPressOpen() {
    setShowTimePicker(!showTimePicker);
    setModalon(!modalon);
  }

  function handleTimeChange(selectedTime) {
    setTime(selectedTime);
    setTextT(selectedTime);
    setpickedtime(false);
    setShowTimePicker(!showTimePicker);
    setModalon(!modalon);
  }

  // const handleSelectedPeople = (selectedPeople) => {
  // const personLabels = Plist.filter((person) =>
  //   selectedPeople.includes(person.value)
  // ).map((person) => person.label);
  // setPerson(personLabels);
  // };

  const handleSelectedPeople = (selectedPeople) => {
    const all_selected = Plist.filter((person) =>
      selectedPeople.includes(person.value)
    );
    setAllSelected(all_selected);

    const personLabels = all_selected.map((person) => person.label);
    const personValues = all_selected.map((person) => person.value);

    setPerson(personLabels);
    setPersonValue(personValues);
  };

  const handleAddEvent = async () => {
    if (pickeddate) {
      Alert.alert("Error", "Please select a date before sending the invite.");
      return;
    }
    if (pickedtime) {
      Alert.alert("Error", "Please select a time before sending the invite.");
      return;
    }
    if (!show) {
      Alert.alert("Error", "Please select a show before sending the invite.");
      return;
    }
    if (person.length === 0) {
      Alert.alert("Error", "Please select people before sending the invite.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("party")
        .select()
        .eq("date", date)
        .eq("show", show);

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        Alert.alert(
          "Error",
          "An event with the same date and show already exists."
        );
        return;
      }

      // insert new event
      const { data: newPartyData, error: newPartyError } = await supabase
        .from("party")
        .insert([
          {
            show: show,
            date: date,
            time: time,
            people: person,
            people_ids: personValue,
            host: session.user.id,
            public: false,
            accepted: [session.user.id.toString()],
          },
        ])
        .select();

      if (newPartyError) {
        console.error("Error inserting party:", newPartyError);
        return;
      }

      const eventId = newPartyData[0].id;
      // console.log(eventId);

      const formattedDateString = date.replace(/\//g, "-");
      const timestamp = new Date(`${formattedDateString}T${time}`);
      // console.log(timestamp);

      // send out notification
      for (const individual of allSelected) {
        if (individual.value != session.user.id) {
          const invite = await supabase.from("invites").insert([
            {
              created_at: new Date(),
              from: session.user.id,
              to: individual.value,
              event_time: timestamp,
              people: person,
              people_ids: personValue,
              name: show,
              event_id: eventId,
            },
          ]);
          // console.log(invite);
        }
      }

      // navigate to success
      navigation.navigate("Success", {
        date: date,
        name: show,
        people: person,
        time: time,
        all: Plist,
        poster: poster,
      });
    } catch (error) {
      Alert.alert("Error", `Failed to add event: ${error.message}`);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setModalon(!modalon);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalon(!modalon);
  };

  const renderPeopleCircles = () => {
    return person.map((personName, index) => {
      const selectedPerson = Plist.find((item) => item.label === personName);
      if (selectedPerson) {
        const photoUri = selectedPerson.photo;
        return (
          <View key={index} style={styles.personCircle}>
            <Image
              source={{ uri: photoUri }}
              style={{ width: 45, height: 45, borderRadius: 22.5 }}
            />
            <Text numberOfLines={1} style={styles.circletext}>
              {personName}
            </Text>
          </View>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    const showPoster = async () => {
      const movieDetails = await getMovieDetails(show);
      setPoster(movieDetails.Poster);
    };
    showPoster();
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
    if (show && !selectionChosen) {
      setVisibleSuggestions(false);
      fetchSuggestions(show);
    } else {
      setSuggestions([]);
    }

    return () => fetchSuggestions.cancel();
  }, [show, fetchSuggestions]);

  dismissKeyboard = () => {
    Keyboard.dismiss();
    return false;
  };

  return (
    <LinearGradient
      colors={["#0e0111", "#311866"]}
      style={styles.container}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.scrollView}>
        <View style={styles.top}>
          <View style={styles.wicon}>
            <FontAwesome name="calendar-o" size={27} color="white" />
            <Pressable onPress={handleOnPressOpen} style={styles.datepick}>
              <Text style={pickeddate ? styles.placeholder : styles.hooray}>
                {pickeddate ? "Select Date" : text}
              </Text>
            </Pressable>
            <CustomModal
              modalVisible={modalVisible}
              closeModal={closeModal}
              handleSelectedPeople={handleSelectedPeople}
              plist={Plist}
            />
          </View>
          <View style={styles.wicon}>
            <FontAwesome5 name="clock" size={27} color="white" />
            <Pressable
              onPress={handleTimePickerPressOpen}
              style={styles.datepick}
            >
              <Text style={pickedtime ? styles.placeholder : styles.hooray}>
                {pickedtime ? "Select Time" : textT}
              </Text>
            </Pressable>
          </View>

          <Modal animationType="none" transparent={true} visible={open}>
            <View style={styles.centeredView}>
              {modalon && (
                <View style={styles.blur}>
                  <View style={styles.modalView}>
                    <DatePicker
                      options={{
                        backgroundColor: "black",
                        borderRadius: 10,
                        borderWidth: 3,
                        textHeaderColor: "white",
                        textDefaultColor: "#858AE3",
                        selectedTextColor: "black",
                        mainColor: "white",
                        textSecondaryColor: "white",
                      }}
                      testID="dateTimePicker"
                      mode="calendar"
                      selected={date}
                      onDateChange={handleChange}
                    />
                    <View
                      style={{
                        backgroundColor: "#858AE3",
                        borderRadius: 100,
                        width: windowWidth * 0.3,
                      }}
                    >
                      <Button
                        title="Select"
                        color="black"
                        onPress={() => {
                          console.log(date);
                          handleChange1(date);
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </Modal>
          <Modal
            animationType="none"
            transparent={true}
            visible={showTimePicker}
          >
            <View style={styles.centeredView}>
              {modalon && (
                <View style={styles.blur}>
                  <View style={styles.modalView}>
                    <DatePicker
                      options={{
                        backgroundColor: "black",
                        textHeaderColor: "#858AE3",
                        textDefaultColor: "white",
                        selectedTextColor: "white",
                        mainColor: "#858AE3",
                        textSecondaryColor: "purple",
                      }}
                      mode="time"
                      value={time} // Set the current time as the initial value
                      onTimeChange={handleTimeChange}
                    />
                  </View>
                </View>
              )}
            </View>
          </Modal>
        </View>
        <View style={styles.ccontainer}>
          <View style={styles.eachBox}>
            <Ionicons name="film-outline" size={30} color="white" />
            <View style={styles.input}>
              <TextInput
                style={[
                  styles.titleDropdown,
                  { color: selectionChosen ? "purple" : "gray" },
                ]}
                placeholder="Enter a movie or show title..."
                placeholderTextColor="gray"
                value={
                  (show ? show : "") +
                  (selectedYear ? ` (${selectedYear})` : "")
                }
                onChangeText={(text) => {
                  setShow(text);
                  setSelectedYear("");
                  setSelectionChosen(false);
                }}
              />
              {show && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    setShow("");
                    setSelectedYear("");
                    setSelectionChosen(false);
                    setSuggestions([]);
                    setVisibleSuggestions(false);
                  }}
                >
                  <MaterialIcons
                    name="cancel"
                    size={20}
                    color={"grey"}
                    style={styles.clearButton}
                  />
                </Pressable>
              )}
            </View>
          </View>
          {visibleSuggestions && (
            <View style={styles.sharedContainer}>
              {suggestions.length > 0 ? (
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.imdbID}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => {
                        setShow(item.Title);
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
                        <Text style={{ color: "white" }}>({item.Year})</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 200 }}
                />
              ) : show !== null && show.trim() !== "" ? (
                <View style={styles.noSuggestionsContainer}>
                  <View style={styles.noSuggestionsTextContainer}>
                    <Text style={styles.noSuggestionsText}>
                      No movies or TV shows match that title.
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}

          <View style={styles.eachBox}>
            <Ionicons name="people" size={30} color="white" />
            <Pressable onPress={openModal} style={styles.input}>
              <View style={styles.input1}>
                <Text
                  style={[styles.replaceText, { fontSize: 14, color: "grey" }]}
                >
                  {person.length > 0
                    ? "Click here to edit people list"
                    : "Select people"}
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.peopleContainer}>{renderPeopleCircles()}</View>

          <View style={styles.space}></View>
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleAddEvent}>
        <Text style={{ color: "#000814", fontSize: 17, fontWeight: "bold" }}>
          Send Invites
        </Text>
      </Pressable>
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    height: "90%",
    top: windowHeight * 0.1,
  },
  space: {
    height: 500,
  },
  bottom: {
    height: 300,
    justifyContent: "end",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    backgroundColor: "transparent",
  },
  ccontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    backgroundColor: "transparent",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 35,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  input1: {
    width: windowWidth * 0.7,
    height: 30,
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  button: {
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "#858AE3",
    width: 200,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 10,
    bottom: windowHeight * 0.15,
  },
  selecttext: {
    color: "purple",
  },
  eachBox: {
    height: windowHeight * 0.05,
    width: windowWidth * 0.85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
  },
  eachBox1: {
    flex: 1,
    padding: 5,
    width: windowWidth * 0.88,
    height: windowHeight * 0.41,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  dropdown: {
    color: "purple",
    height: 50,
    width: windowWidth * 0.7,
    borderRadius: 50,
  },
  blur: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown1: {
    color: "purple",
    width: windowWidth * 0.65,
    borderRadius: 50,
  },
  dropdown2: {
    color: "purple",
    height: 30,
    width: windowWidth * 0.65,
  },
  icon: {
    marginRight: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "purple",
  },
  iconStyle: {
    width: 10,
    aspectRatio: 1,
  },
  selectedStyle: {
    flexDirection: "column",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 7,
    paddingLeft: 5,
    paddingRight: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: "hidden",
  },
  textSelectedStyle: {
    color: "purple",
    marginRight: 5,
    fontSize: 13,
    alignSelf: "center",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "black",
  },
  placeholderStyle2: {
    fontSize: 16,
    color: "gray",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  top: {
    height: windowHeight * 0.075,
    width: windowWidth * 0.85,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    alignSelf: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "black",
    borderRadius: 10,
    borderColor: "white",
    width: "90%",
    padding: 35,
    alignItems: "center",
  },
  datepick: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginLeft: 10,
    height: windowHeight * 0.043,
  },
  wicon: {
    width: "45%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  placeholder: {
    color: "grey",
  },
  hooray: {
    color: "purple",
  },
  photo: {
    width: 50,
    height: 50,
  },
  peopleContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "start",
    paddingLeft: 25,
    margin: 10,
    flexWrap: "wrap",
  },
  personCircle: {
    margin: 5,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  circletext: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  titleDropdown: {
    flex: 1,
    color: "purple",
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
    height: 150,
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
    borderColor: "lightgrey",
  },
  suggestionItem: {
    padding: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingBottom: 2,
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
    color: "lightgray",
  },
});

export default AddEvent;
