import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Friend from "./Friend";
import supabase from "../../Supabase";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import filter from "lodash.filter";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function People() {
  const [session, setSession] = useState(null);
  const [friendIDs, setFriendIDs] = useState(null);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  const handleFriendUpdated = (payload) => {
    let updatedFriendIds = payload.new.friend_ids;
    if (session) {
      updatedFriendIds = payload.new.friend_ids.filter(
        (friendId) => friendId !== session.user.id
      );
    }
    setFriendIDs(updatedFriendIds);
  };

  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        handleFriendUpdated
      )
      .subscribe();
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
          const friends = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id);
          const updatedFriendIds = friends.data[0].friend_ids.filter(
            (friendId) => friendId !== session.user.id
          );
          setFriendIDs(updatedFriendIds);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchFriendsWithMessages = async () => {
        if (friendIDs) {
          try {
            const response = await supabase
              .from("profiles")
              .select("*")
              .in("id", friendIDs);

            const friendsData = response.data;

            for (const friend of friendsData) {
              const { data: messages, error: messagesError } = await supabase
                .from("messages")
                .select("msg, date")
                .or(`from.eq.${friend.id},to.eq.${friend.id}`)
                .order("date", { ascending: false })
                .limit(1);

              if (messagesError) {
                console.error("Error fetching messages:", messagesError);
              } else if (messages.length > 0) {
                friend.recentMessage = messages[0].msg;
                friend.recentMessageDate = messages[0].date;
              } else {
                friend.recentMessage = "No recent messages";
                friend.recentMessageDate = null;
              }
            }

            friendsData.sort((a, b) => {
              if (a.recentMessageDate && b.recentMessageDate) {
                return (
                  new Date(b.recentMessageDate) - new Date(a.recentMessageDate)
                );
              } else if (a.recentMessageDate) {
                return -1;
              } else {
                return 1;
              }
            });

            setData(friendsData);
            setFilteredData(friendsData);
          } catch (error) {
            console.error("Error fetching friends:", error);
          }
        }
      };

      fetchFriendsWithMessages();
    }, [friendIDs])
  );

  const clearSearch = () => {
    setFilteredData(data);
    setSearchQuery("");
  };

  const handleSearch = () => {
    const formattedQuery = searchQuery.toLowerCase();
    const filteredData = filter(data, ({ username }) => {
      return contains({ username }, formattedQuery);
    });
    setFilteredData(filteredData);
  };

  const contains = ({ username }, query) => {
    return username.toLowerCase().includes(query);
  };

  const onDeleteFriend = async (idToDelete) => {
    const updatedFriendIDs = friendIDs.filter((id) => id !== idToDelete);

    const deleteFriend = await supabase
      .from("profiles")
      .update({ friend_ids: updatedFriendIDs })
      .eq("id", session.user.id);

    setFriendIDs(updatedFriendIDs);
  };

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
      <View style={styles.container1}>
        <View style={styles.input}></View>

        <View style={styles.searchBar}>
          <TextInput
            numberOfLines={1}
            style={{ flex: 1, color: "black", textAlign: "left" }}
            placeholder="Search by Username"
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={(query) => setSearchQuery(query)}
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

        <View style={styles.friendList}>
          <FlatList
            data={filteredData}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("ChatScreen", {
                    id: item.id,
                    username: item.username,
                    profilePic: item.avatar_url,
                    currentUserID: session.user.id,
                  })
                }
              >
                <View style={styles.friendbox}>
                  <Friend
                    id={item.id}
                    user={item.username}
                    profilePic={item.avatar_url}
                    onDeleteFriend={() => onDeleteFriend(item.id)}
                  />
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
            style={styles.posts}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.plusButton}
          onPress={() =>
            navigation.navigate("AddFriendPage", { screen: "AddFriendPage" })
          }
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
  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 10,
  },
  container1: {
    backgroundColor: null,
    flex: 1,
  },
  friendbox: {
    backgroundColor: null,
  },
  friendList: {
    backgroundColor: null,
    flex: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: windowWidth * 0.13,
  },
  searchbutton: {
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  main: {
    height: windowHeight * 0.5,
    width: windowWidth,
    backgroundColor: null,
    flexDirection: "column",
    width: windowWidth,
    height: windowHeight,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "white",
    margin: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cal: {
    width: "100%",
    backgroundColor: "transparent",
    height: "5%",
    borderWidth: 5,
    borderColor: "green",
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
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
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
    zIndex: 1,
  },
  plusButton: {
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  posts: {
    backgroundColor: null,
  },
});
