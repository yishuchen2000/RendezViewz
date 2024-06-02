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

const Pending = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [flatListData, setFlatListData] = useState([]);
  const [items, setItems] = useState([]);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentTime = new Date().toISOString();
      const fetchData = async () => {
        const currentDate = new Date();

        const pending = await supabase
          .from("invites")
          .select(
            `
    *,
    profiles ( username ),
    party ( accepted, people_ids )
    `
          )
          .is("accepted", null)
          .eq("to", session.user.id)
          .gt("event_time", currentTime)
          .order("event_time", { ascending: true });

        const data = pending.data;
        // console.log("pending", pending);
        console.log("INITIAL DATA", data);
        setItems(pending.data);
      };
      fetchData();
    });
  }, []);

  const handleInvitesUpdated = (payload) => {
    console.log("THIS IS PAYLOAD", payload.new);

    setItems((oldItems) => {
      const newItems = oldItems.filter((item) => item.id !== payload.new.id);
      return newItems.length > 0 ? newItems : [];
    });
    console.log("after filter", items);
    setFlatListData(items);
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

  const handleAccept = async (
    invite_id,
    event_id,
    accepted_friend_ids,
    accept
  ) => {
    const invites_response = await supabase
      .from("invites")
      .update({ accepted: accept })
      .eq("id", invite_id);

    // change accept status on the general event table
    // filter for same host, same show, same time

    if (accept) {
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
    }
  };

  useEffect(() => {
    if (!items || items.length === 0) {
      // Items not yet fetched or empty, return early
      return;
    }

    const formattedData = items.map((item) => {
      const eventDate = new Date(item.event_time);
      const currentDate = new Date();
      const date = eventDate.toISOString().split("T")[0];
      const time = eventDate.toISOString().split("T")[1].slice(0, 5);
      // console.log(item.party.accepted);

      return {
        key: `${date}-${item.name}`,
        id: item.id, // invite id
        invite: item.profiles.username,
        date: date,
        time: time,
        name: item.name,
        people: item.people,
        event_id: item.event_id,
        people_ids: item.party.people_ids,
        accepted_friend_ids: item.party.accepted,
      };
    }, []);
    console.log("current data seg", formattedData);
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
          <View style={styles.inside1}>
            <Text style={styles.invitee}>{item.invite}</Text>
            <Text style={styles.textt}> cordially invites you to: </Text>
          </View>
          <View style={styles.tiempo}>
            <Text style={styles.datet}>{item.date}</Text>
            <Text style={styles.timet}>{item.time}</Text>
          </View>
          <View style={styles.tiempo1}>
            <Text numberOfLines={1} style={styles.showt}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.timet}>
              (w/ {item.people.join(", ")})
            </Text>
          </View>
        </View>
        <View style={styles.accept}>
          <View style={styles.crossContainer}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Confirm Acceptance",
                  "Are you sure you want to say yes to this event?",

                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Accept Invite",
                      onPress: () =>
                        handleAccept(
                          item.id,
                          item.event_id,
                          item.accepted_friend_ids,
                          true
                        ),
                    },
                  ],
                  { cancelable: false }
                );
              }}
              style={styles.crossContainer}
            >
              <AntDesign name="check" size={20} color="#97DFFC" />
            </Pressable>
          </View>
          <View style={styles.crossContainer}>
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Confirm Deletion",
                  "Are you sure you want to say no to this event?",
                  [
                    {
                      text: "cancel",
                      style: "cancel",
                    },
                    {
                      text: "Decline invite",
                      onPress: () =>
                        handleAccept(
                          item.id,
                          item.event_id,
                          item.accepted_friend_ids,
                          false
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
      </View>
    </Pressable>
  );

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
            returnKeyType="search"
            onSubmitEditing={handleSearch}
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
  accept: {
    height: windowHeight * 0.07,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    //borderColor: "red",
    //borderWidth: 5,
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
  inside1: {
    flexDirection: "row",
    justifyContent: "start",
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
  tiempo1: {
    width: windowWidth * 0.8,
    flexDirection: "row",
    justifyContent: "start",
  },
  timet: {
    color: "white",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  textt: {
    color: "white",
    fontSize: 16,
    marginLeft: 2,
  },
  invitee: {
    color: "#97DFFC",
    fontSize: 16,
  },
  datet: {
    color: "white",
    marginRight: 5,
  },
  showt: {
    color: "#97DFFC",
    fontSize: 16,
    marginRight: 5,
  },
  showt2: {
    color: "black",
    fontSize: 16,
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
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
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

export default Pending;
