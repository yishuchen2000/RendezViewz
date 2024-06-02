/* First Screen of the Invite Box
 */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
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
  const [items, setItems] = useState(null);
  const [session, setSession] = useState(null);

  const fetchData = async (session) => {
    console.log(session);
    // const currentDate = new Date();
    const currentTime = new Date().toISOString();
    try {
      // [1] fetch invites that are accepted (current user = invitee)
      const { data, error } = await supabase
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

      // [2] fetch events where the host is the current user (current user = host)
      const response = await supabase
        .from("party")
        .select("*")
        .eq("host", session.user.id)
        .order("date", { ascending: false });
      console.log("data2", response.data);
      const data2 = response.data;

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        const formattedData = {};

        // Get the current date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Loop through each day of the year
        for (let month = 0; month < 12; month++) {
          for (let day = 1; day <= 31; day++) {
            const date = new Date(currentYear, month, day)
              .toISOString()
              .split("T")[0];
            formattedData[date] = [];
          }
        }

        // [1]
        data.forEach((event) => {
          const { id, date, time, show, people, host, accepted, people_ids } =
            event.party;

          // console.log(
          //   "[1]",
          //   id,
          //   date,
          //   time,
          //   show,
          //   people,
          //   host,
          //   accepted,
          //   people_ids
          // );

          if (!formattedData[date]) {
            formattedData[date] = [];
          }

          formattedData[date].push({
            name: show,
            people: people,
            time: time,
            date: date,
            id: id,
            host_id: host,
            accepted_friend_ids: accepted,
            people_ids: people_ids,
          });
        });

        // add events with current user as host
        data2.forEach((event) => {
          const { id, date, time, show, people, host, accepted, people_ids } =
            event;

          // console.log(
          //   "[2]",
          //   id,
          //   date,
          //   time,
          //   show,
          //   people,
          //   host,
          //   accepted,
          //   people_ids
          // );

          if (!formattedData[date]) {
            formattedData[date] = [];
          }

          formattedData[date].push({
            name: show,
            people: people,
            time: time,
            date: date,
            id: id,
            host_id: host,
            accepted_friend_ids: accepted,
            people_ids: people_ids,
          });
        });

        console.log("PEOPLE IDS???", formattedData);

        setItems(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      // console.log(session.user.id);
      // setUserId(session.user.id);

      if (session) {
        fetchData(session);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (
    id,
    event_id,
    accepted_friend_ids,
    host_id,
    date,
    eventName
  ) => {
    console.log(
      "INPUT DATA TO DELETE",
      id,
      event_id,
      accepted_friend_ids,
      host_id,
      date,
      eventName
    );
    // [1] you are the host - delete event for everyone
    if (host_id === session.user.id) {
      try {
        // delete all event invites from invites
        const { error2 } = await supabase
          .from("invites")
          .delete()
          .eq("event_id", event_id);

        // Delete the event from party
        const { error } = await supabase
          .from("party")
          .delete()
          .eq("id", event_id);

        if (error) {
          throw new Error(error.message);
        }

        if (error2) {
          throw new Error(error2.message);
        }

        // Update the UI after successful deletion
        const updatedItems = { ...items };
        console.log("updatedItems", updatedItems);
        const index = updatedItems[date].findIndex(
          (event) => event.id === event_id
        );
        if (index !== -1) {
          updatedItems[date].splice(index, 1);
          setItems(updatedItems);
          setFlatListData(updatedItems);
        }

        Alert.alert("Success", "Event deleted successfully!");
      } catch (error) {
        Alert.alert(
          "Error",
          `Failed to delete event in case [1]: ${error.message}`
        );
      }
    } else {
      try {
        // [2] you are a participant - change current pending to false, delete the uuid from the party table
        // change accept status on the general event table
        const { error2 } = await supabase
          .from("invites")
          .update({ accepted: false })
          .eq("event_id", event_id)
          .eq("to", session.user.id);

        // remove the current uuid from the corresponding party entry

        // filter through all items, find the item with the same event_id, get the party - accepted - array
        // item.party.accepted
        const updated_accepted = accepted_friend_ids;
        if (!accepted_friend_ids.includes(session.user.id)) {
          updated_accepted.push(session.user.id);
        }
        const { error } = await supabase
          .from("party")
          .update({ accepted: updated_accepted })
          .eq("id", event_id);

        // console.log("updated_accepted", updated_accepted);

        if (error) {
          throw new Error(error.message);
        }

        if (error2) {
          throw new Error(error2.message);
        }

        // Update the UI after successful deletion
        const updatedItems = { ...items };
        console.log("updatedItems", updatedItems);
        const index = updatedItems[date].findIndex(
          (event) => event.id === event_id
        );
        if (index !== -1) {
          updatedItems[date].splice(index, 1);
          setItems(updatedItems);
          setFlatListData(updatedItems);
        }

        Alert.alert("Success", "Event deleted successfully!");
      } catch (error) {
        Alert.alert(
          "Error",
          `Failed to delete event in case [2]: ${error.message}`
        );
      }
    }
  };

  useEffect(() => {
    if (items) {
      console.log("ITEMS before formattedData in Flatlist", items);
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
            accepted_friend_ids: movie.accepted_friend_ids,
            people_ids: movie.people_ids,
            host_id: movie.host_id,
          });
        });
        return acc;
      }, []);
      setFlatListData(formattedData);
      console.log("formattedData in Flatlist", formattedData);
    }
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

  if (!items) {
    return (
      <LinearGradient
        colors={["#0e0111", "#311866"]}
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

  const renderItem = ({ item }) => {
    console.log("Item in renderItem", item);
    // Ensure the item exists and has the required properties
    if (!item || !item.date || !item.name || !item.people || !item.time) {
      return null; // or a placeholder component
    }

    return (
      <Pressable
        onPress={() => {
          navigation.navigate("EventDetail", {
            date: item.date,
            name: item.name,
            people: item.people,
            time: item.time,
            people_ids: item.people_ids,
            accepted: item.accepted_friend_ids,
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
                          item.accepted_friend_ids,
                          item.host_id,
                          item.date,
                          item.time,
                          item.name
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
  };

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
        width={windowWidth}
        alignSelf="center"
        extraData={searchQuery}
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
