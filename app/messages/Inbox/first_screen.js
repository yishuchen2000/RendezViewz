//This file is the webview page for song details.
//This page is opened when clicking anywhere on the row of a song on first_screen
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  Image,
} from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import supabase from "../../../Supabase";

const Events = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [flatListData, setFlatListData] = useState([]);
  const [items, setItems] = useState({});
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session);
      setSession(session);

      const currentTime = new Date().toISOString();
      const fetchData = async () => {
        const currentDate = new Date();

        // case 1: you are invited to an event and you accepted it
        const { data1, error1 } = await supabase
          .from("invites")
          .select(
            `
            *,
    party ( id, accepted, show, date, time, people, people_ids, host, accepted, public ),
    profiles ( username )
    `
          )
          .eq("accepted", true)
          .eq("to", session.user.id)
          .gt("event_time", currentTime)
          .order("event_time", { ascending: true });

        console.log("data", data);

        const fData = {};
        // filter data

        // Add events to the formattedData object
        data.forEach((event) => {
          const { id, date, time, show, people } = event.party;
          const itemDate = new Date(date);

          if (!fData[date]) {
            fData[date] = [];
          }
          console.log(itemDate);
          console.log(currentDate);

          fData[date].push({
            name: show,
            people: people,
            time: time,
            date: date,
            id: id,
          });
        });

        setItems(fData);
        console.log("fDATA", items);
      };
      fetchData();
    });
  }, []);

  const handleInvitesUpdated = (payload) => {
    console.log("THIS IS PAYLOAD", payload.new);

    if (payload.new.accepted) {
      // insert
      const { event_id, event_time, name, people } = payload.new;
      // Convert event_time (timestamp) to date and time
      const eventDate = new Date(event_time);

      // Format date as YYYY-MM-DD
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const day = String(eventDate.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

      // Format time as HH:mm:ss
      const hours = String(eventDate.getHours()).padStart(2, "0");
      const minutes = String(eventDate.getMinutes()).padStart(2, "0");
      const seconds = String(eventDate.getSeconds()).padStart(2, "0");
      const time = `${hours}:${minutes}:${seconds}`;

      // const itemDate = new Date(date);
      const updated_items = items;

      if (!updated_items[date]) {
        updated_items[date] = [];
      }
      // console.log(itemDate);
      // console.log(currentDate);

      updated_items[date].push({
        name: name,
        people: people,
        time: time,
        date: date,
        id: event_id,
      });
      console.log("items", updated_items);
      setItems(updated_items);
      setFlatListData(updated_items);
    }
  };

  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "invites" },
        handleInvitesUpdated
      )
      .subscribe();
  }, []);

  const handleDelete = async (invite_id, event_id, accepted_friend_ids) => {
    const invites_response = await supabase
      .from("invites")
      .update({ accepted: !accepted })
      .eq("id", invite_id);

    // change accept status on the general event table
    // filter for same host, same show, same time

    // filter through all items, find the item with the same event_id, get the party - accepted - array
    // item.party.accepted
    const updated_accepted = accepted_friend_ids;
    if (!accepted_friend_ids.includes(session.user.id)) {
      updated_accepted.push(session.user.id);
    }
    // console.log("updated_accepted", updated_accepted);

    const party_response = await supabase
      .from("party")
      .update({ accepted: updated_accepted })
      .eq("id", event_id);

    // console.log("party_response", party_response);
  };

  useEffect(() => {
    const formattedData = Object.keys(items).reduce((acc, date) => {
      const movies = items[date];
      movies.forEach((movie) => {
        acc.push({
          key: `${date}-${movie.name}`,
          date: movie.date,
          time: movie.time,
          name: movie.name,
          people: movie.people,
          event_id: movie.id,
          accepted_friend_ids: movie.accepted,
        });
      });
      return acc;
    }, []);
    setFlatListData(formattedData);
  }, [items]);

  const handleSearchInput = (text) => {
    setSearchInput(text); // Update temporary search input
  };

  const handleSearch = () => {
    setSearchQuery(searchInput.toLowerCase()); // Set the search query only when the search button is pressed
    const query = searchInput.toLowerCase();
    const filtered = flatListData.filter((item) => {
      const isNameMatch = item.name.toLowerCase().includes(query);
      const isPersonMatch = item.people.some((person) =>
        person.toLowerCase().includes(query)
      );

      return isNameMatch || isPersonMatch;
    });

    setFilteredData(filtered);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchInput("");
    setFilteredData([]);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        //console.log(flatListData);
        navigation.navigate("event_detail", {
          date: item.date,
          name: item.name,
          people: item.people,
          time: item.time,
        });
      }}
    >
      <View style={styles.background}>
        <View style={styles.inside}>
          <View style={styles.tiempo}>
            <Text style={styles.datet}>{item.date}</Text>
            <Text style={styles.timet}>{item.time}</Text>
          </View>
          <Text numberOfLines={1} style={styles.showt}>
            {item.name}
          </Text>
          <Text numberOfLines={1} style={styles.timet}>
            {item.people.join(", ")}
          </Text>
        </View>
        <View style={styles.crossContainer}>
          <Pressable
            onPress={() => {
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to remove this event?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: () =>
                      handleDelete(
                        item.id,
                        item.event_id,
                        item.accepted_friend_ids
                      ),
                  },
                ],
                { cancelable: false }
              );
            }}
            style={styles.crossContainer}
          >
            <AntDesign name="close" size={20} color="gray" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <View style={styles.searchArea}>
        <View style={styles.searchContainer}>
          <TextInput
            numberOfLines={1}
            style={{ color: "purple", textAlign: "left" }}
            placeholder="Search event by movie/show/people"
            placeholderTextColor="gray"
            value={searchInput}
            onChangeText={handleSearchInput}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
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
      </View>

      <FlatList
        data={searchQuery ? filteredData : flatListData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        width={windowWidth}
        alignSelf="center"
        extraData={searchQuery} // This line ensures re-rendering when searchQuery changes
      />
      <View style={styles.clapboard}>
        <Image
          source={require("../../../assets/Clapboard2.png")}
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
  container: {
    flex: 1,
    //alignItems: "center",
    justifyContent: "center",
    //padding: 24,
    paddingTop: 15,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  background: {
    height: windowHeight * 0.09,
    margin: 5,
    flexDirection: "row",
    width: windowWidth * 0.95,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "space-between",
    //padding: 24,
    backgroundColor: "rgba(151, 223, 252, 0.17)",
    borderRadius: 15,
    alignSelf: "center",
  },
  inside: {
    flexDirection: "column",
    justifyContent: "space-between",

    width: windowWidth * 0.8,
  },
  crossContainer: {
    width: windowWidth * 0.08,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  tiempo: {
    width: windowWidth * 0.33,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timet: {
    color: "white",
  },
  datet: {
    color: "white",
    marginRight: 5,
  },
  showt: {
    color: "#97DFFC",
    fontSize: 16,
    marginTop: 8,
  },
  searchContainer: {
    height: windowHeight * 0.04,
    width: windowWidth * 0.85,
    paddingLeft: 10,
    paddingRight: 3,
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 50,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    padding: 10,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "start",
    flex: 1,
  },
  searchbutton: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: windowWidth * 0.075,
    //borderColor: "red",
    //borderWidth: 5,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",

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
  inboxtext: {
    color: "white",
    fontSize: 15,
  },

  overall: {
    flexDirection: "column",
    alignItems: "center",
    //padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #0e0111, #311866)",
  },
  time: {
    alignItems: "center",
    margin: 10,
  },
  date: {
    fontSize: 25,
    color: "white",
  },
  hour: {
    fontSize: 20,
    color: "white",
  },
  show: {
    fontSize: 35,
    color: "white",
    textAlign: "center",
  },
  image: {
    height: windowHeight * 0.3,
    width: windowHeight * 0.25,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 10,
  },
  peopleContainer: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    flexWrap: "wrap", // This line makes the content wrap within the container
  },
  personCircle: {
    margin: 2,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  circletext: {
    fontSize: 15,
    paddingBottom: 10,
    color: "white",
    textAlign: "center",
  },
  circletext: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  circletext1: {
    fontSize: 15,
    marginTop: 20,
    color: "white",
    textAlign: "center",
  },
});

export default Events;
