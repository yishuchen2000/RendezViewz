import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import supabase from "../Supabase";
import { LinearGradient } from "expo-linear-gradient";
import Post from "../components/Post";
import getRecommendations from "../components/GPT";
import Poster from "../components/Poster";
import { StatusBar } from "expo-status-bar";
import { StatusBarHeight } from "expo-status-bar";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const HEADER_MAX_HEIGHT = 200;

export default function Page() {
  const [session, setSession] = useState(null);
  const [friendIDs, setFriendIDs] = useState(null);
  const [showPostIDs, setshowPostIDs] = useState(null);

  const [data, setData] = useState(null);
  const [input, setInput] = useState("");

  // SCROLL COMPONENT
  const scrollY = new Animated.Value(0);
  const translateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -200],
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const [recs, setRecs] = useState([
    "Frozen II",
    "Spider-Man: Into the Spider-Verse",
    "Moana",
    "Toy Story 4",
    "How to Train Your Dragon: The Hidden World",
    "Kung Fu Panda 3",
    "Big Hero 6",
    "Zootopia",
    "Raya and the Last Dragon",
    "Onward",
  ]);

  const handleRecordUpdated = (payload) => {
    setData((oldData) => {
      return oldData.map((item) => {
        if (item.id === payload.new.id) {
          return payload.new;
        }
        return item;
      });
    });
  };

  const handleRecordInserted = (payload) => {
    setData((oldData) => [...oldData, payload.new]);
  };

  const handleRecordDeleted = (payload) => {
    setData((oldData) => oldData.filter((item) => item.id !== payload.old.id));
  };

  const onMessageSend = async () => {
    const response = await supabase.from("posts").insert({
      user: "James Landay",
      timestamp: "now",
      text: input,
    });
  };

  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        handleRecordUpdated
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        handleRecordInserted
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        handleRecordDeleted
      )
      .subscribe();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      const fetchRankings = async () => {
        const rankings = await supabase
          .from("rankings")
          .select("*")
          .eq("user_id", session.user.id);

        // RECOMMENDATION FETURE STARTS HERE!!!
        //   let genres = rankings.data.map((item) => item.genres);
        //   const genresString = genres.map((genre) => genre.join(", ")).join(", ");

        //   console.log("this is GENRES", genresString);

        //   try {
        //     const output = await getRecommendations(genresString);
        //     console.log("THIS IS GPT Output", output);
        //     const jsonString = output.replace(/'/g, '"');
        //     const responseArray = JSON.parse(jsonString);

        //     console.log("THIS IS FINAL OUTPUT", responseArray);
        //     console.log("THIS IS OUTPUT TYPE", typeof responseArray);

        //     setRecs(responseArray);
        //   } catch (error) {
        //     console.error("Error fetching recommendations:", error);
        //   }
      };
      fetchRankings();

      const fetchFriendID = async () => {
        const friends = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id);

        // console.log("this is the current session", session);
        // console.log("this is the friend IDs", friends.data[0].friend_ids);
        // filter out the current user
        setFriendIDs(friends.data[0].friend_ids);
      };
      fetchFriendID();
    });
  }, []);

  useEffect(() => {
    if (friendIDs) {
      finalIDs = [...friendIDs, session.user.id];
      setshowPostIDs(finalIDs);
      const fetchData = async () => {
        const response = await supabase
          .from("posts")
          .select("*")
          .in("user_id", finalIDs)
          .order("created_at", { ascending: false });

        setData(response.data);
      };
      fetchData();
    }
  }, [friendIDs]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await supabase
  //       .from("posts")
  //       .select("*")
  //       .order("created_at", { ascending: false });
  //     setData(response.data);
  //   };
  //   fetchData();
  // }, []);

  if (!data) {
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
      {/* <View style={styles.composer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setInput(text)}
          value={input}
          placeholder="Write a post..."
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
        />
        <TouchableOpacity style={styles.send} onPress={onMessageSend}>
          <FontAwesome name="send" size={20} color="#BBADD3" />
        </TouchableOpacity>
      </View> */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: translateY }],
            elevation: 4,
            zIndex: 100,
          },
        ]}
        // style={styles.header}
      >
        {/*        
        <View style={styles.header}> */}
        <Text style={[styles.subText, styles.recent]}>Recommendations</Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          horizontal={true}
        >
          {/* Content inside the horizontal ScrollView */}
          {recs.map((item) => (
            <Poster title={item} goesTo={"ShowDetails"} />
          ))}
        </ScrollView>
        {/* </View> */}
      </Animated.View>

      <View style={styles.middle}>
        <View style={styles.postList}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Post
                showPostIDs={showPostIDs}
                sessionID={session.user.id}
                id={item.user_id}
                timestamp={item.created_at}
                text={item.text}
                liked={item.liked}
                profilePic={item.profile_pic}
                action={item.action}
                rawComments={item.comments}
                title={item.movie_title}
                avatarGoesTo={"FriendProfile"}
                posterGoesTo={"ShowDetails"}
                liked_by={item.liked_by}
              />
            )}
            keyExtractor={(item) => item.id}
            style={styles.posts}
            contentContainerStyle={{ paddingTop: 10 }}
            ListHeaderComponent={
              <View style={{ paddingTop: windowHeight * 0.21 }}>
                <Text style={[styles.subText, styles.recent]}>Posts</Text>
              </View>
            }
            onScroll={(e) => {
              scrollY.setValue(e.nativeEvent.contentOffset.y);
            }}
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
    justifyContent: "center",
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
    paddingRight: 8,
    paddingLeft: 8,
  },
  subText: {
    fontSize: 12,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  recent: {
    marginLeft: 4,
    marginTop: 11,
    marginBottom: 10,
    fontSize: 18,
  },
  middle: {
    flex: 1,
    // height: "100%",
    borderColor: "red",
    // borderWidth: 1,
    // marginTop: 10,
  },
  posts: {
    // marginTop: 12,
    flex: 1,
    borderColor: "white",
    // borderWidth: 1,
    // marginTop: 30,
  },
  scroll: {
    // borderWidth: 1,
    flex: 1,
  },
  postList: {
    flex: 3.5,
    // borderWidth: 1,
    // boarderColor: "blue",
  },
  header: {
    flexDirection: "column",
    position: "absolute",
    top: 0,
    left: 8,
    right: 0,

    // flex: 1,
    // backgroundColor: "white",
    width: "100%",
    height: "30%",
    // flex: 1,
    // paddingHorizontal: 12,
    // paddingVertical: 8,
    // gap: 8,
    // borderColor: "green",
    // borderWidth: 1,
  },

  clapboard: {
    // position: "abolute",
    // bottom: windowHeight * 0.015,
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },

  input: {
    flex: 1,
    height: 30,
    paddingHorizontal: 8,
    backgroundColor: "rgba(173, 216, 230, 0.5)",
    borderRadius: 999,
  },
  send: {
    alignItems: "center",
    justifyContent: "center",
  },
});
