//landing page of calendar
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { initialItems } from "./eventdata";
import { Calendar, LocaleConfig, Agenda } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import supabase from "../../Supabase";
import AddEvent from "./add_event";
import getHostInfo from "../../components/getMovieDetails";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function FirstScreen({ navigation }) {
  const [selected, setSelected] = useState("");
  const [items, setItems] = useState({});
  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);

  const fetchData = async (session) => {
    try {
      // fetch invites that are accepted
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
        .eq("to", session.user.id);

      // fetch events where the host is the current user
      const response = await supabase
        .from("party")
        .select("*")
        .eq("host", session.user.id)
        .order("date", { ascending: false });
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

        // Add events to the formattedData object
        // add accepted invites
        data.forEach((event) => {
          const { id, date, time, show, people, host, accepted, people_ids } =
            event.party;

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
      setUserId(session.user.id);

      if (session) {
        fetchData(session);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const removeEvent = async (
    id,
    event_id,
    accepted_friend_ids,
    host_id,
    date,
    eventName
  ) => {
    if (!id) {
      id = event_id;
    }
    if (!event_id) {
      event_id = id;
    }

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
        const index = updatedItems[date].findIndex(
          (event) => event.id === event_id
        );
        if (index !== -1) {
          updatedItems[date].splice(index, 1);
          setItems(updatedItems);
          // setFlatListData(updatedItems);
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

        if (error) {
          throw new Error(error.message);
        }

        if (error2) {
          throw new Error(error2.message);
        }

        // Update the UI after successful deletion
        const updatedItems = { ...items };
        const index = updatedItems[date].findIndex(
          (event) => event.id === event_id
        );
        if (index !== -1) {
          updatedItems[date].splice(index, 1);
          setItems(updatedItems);
          // setFlatListData(updatedItems);
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

  const doublecheck = (
    id,
    event_id,
    accepted_friend_ids,
    host_id,
    date,
    eventName
  ) => {
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
            removeEvent(
              id,
              event_id,
              accepted_friend_ids,
              host_id,
              date,
              eventName
            ),
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = (item) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("EventDetail", {
            date: item.date,
            name: item.name,
            people: item.people,
            time: item.time,
            people_ids: item.people_ids,
            accepted: item.accepted_friend_ids,
          })
        }
      >
        <View style={styles.itemContainer}>
          <View style={styles.rowcont}>
            <View style={styles.eventInfo}>
              <Text numberOfLines={1} style={{ fontSize: 17, color: "purple" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 10, color: "gray" }}>{item.time}</Text>
              <Text
                numberOfLines={1}
                //ellipsizeMode="tail"
                style={{ fontSize: 10, color: "gray" }}
              >
                {item.people.join(", ")}
              </Text>
            </View>
            <Pressable
              onPress={() =>
                doublecheck(
                  item.id,
                  item.event_id,
                  item.accepted_friend_ids,
                  item.host_id,
                  item.date,
                  item.time,
                  item.name
                )
              }
              style={styles.removeButton}
            >
              <AntDesign name="close" size={20} color="gray" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
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

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      <View style={styles.main}>
        <Agenda
          style={{ width: "100%", height: "100%" }}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#602683",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#602683",
            dayTextColor: "#2d4150",
            textDisabledColor: "#c6c7c9",
            arrowColor: "#602683",
            dotColor: "#602683",
          }}
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          items={items}
          renderItem={renderItem}
        />
        <View style={styles.buttonContainer1}>
          <Pressable
            style={styles.button1}
            onPress={() =>
              navigation.navigate("Inbox", { currentUser: session?.user.id })
            }
          >
            <Feather name="mail" size={30} color="white" />
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("AddEvent", {})}
          >
            <AntDesign name="pluscircle" size={50} color="#602683" />
          </Pressable>
        </View>
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
  container: {
    flex: 1,
    alignItems: "center",
    // padding: 24,
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  rowcont: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventInfo: {
    width: windowWidth * 0.65,
  },
  main: {
    flex: 1,
    // height: windowHeight * 0.5,
    // width: windowWidth,
    backgroundColor: "transparent",
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
    // padding: 5,
    borderWidth: 1,
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
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 50,
    backgroundColor: "white", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  button1: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#602683", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  button2: {
    width: 100,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#602683", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer1: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    right: windowHeight * 0.1,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  buttonContainer2: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.03,
    left: windowHeight * 0.02,
    backgroundColor: "transparent",
  },
  magnify: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.019,
    right: windowHeight * 0.097,
    zIndex: 2,
  },
});
