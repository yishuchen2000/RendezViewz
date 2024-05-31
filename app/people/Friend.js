import { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";
import supabase from "../../Supabase";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Friend = ({ id, user, profilePic, onDeleteFriend, goesTo }) => {
  const navigation = useNavigation();
  const [session, setSession] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [rankedNumber, setRankedNumber] = useState(0);
  const [wishlistNumber, setWishlistNumber] = useState(0);
  const [friendNumber, setFriendNumber] = useState(null);
  const [myPostData, setMyPostData] = useState(null);
  const [recentMessage, setRecentMessage] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    fetchSession();
  }, []);

  const fetchRecentMessage = async () => {
    try {
      const { data: profileInfo, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);
      if (profileError) throw profileError;

      setProfileData(profileInfo);

      const friendNumber = profileInfo[0]?.friend_ids?.length || 0;
      setFriendNumber(friendNumber);

      const { data: myPosts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", id);
      if (postsError) throw postsError;
      setMyPostData(myPosts);

      const { count: rankingsCount, error: rankingsError } = await supabase
        .from("rankings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);
      if (rankingsError) throw rankingsError;

      const { count: wishlistCount, error: wishlistError } = await supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);
      if (wishlistError) throw wishlistError;

      setRankedNumber(rankingsCount);
      setWishlistNumber(wishlistCount);

      if (session) {
        const { data: messages, error: messagesError } = await supabase
          .from("messages")
          .select("*")
          .or(`from.eq.${id},from.eq.${session.user.id}`)
          .or(`to.eq.${id},to.eq.${session.user.id}`)
          .order("date", { ascending: false })
          .limit(1);
        if (messagesError) throw messagesError;

        if (messages && messages.length > 0) {
          setRecentMessage(messages[0].msg);
        } else {
          setRecentMessage("No recent messages");
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRecentMessage("No recent messages");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (session) {
        fetchRecentMessage();
      }
    }, [session, id])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Pressable
            onPress={() =>
              navigation.navigate("FriendProfile", {
                id,
                friendNumber,
                myPostData,
                profileData,
                rankedNumber,
                wishlistNumber,
              })
            }
          >
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>
          </Pressable>
          <View style={styles.profileTextContainer}>
            <Text style={styles.username}>{user}</Text>
            <View style={styles.recentMessageContainer}>
              <Text
                style={styles.recentMessage}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {recentMessage}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Pressable style={styles.deleteButtonContainer}>
        <EvilIcons
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Delete Friend?",
              `Are you sure you want to remove ${user} from friends?`,
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  onPress: onDeleteFriend,
                },
              ],
              { cancelable: false }
            );
          }}
          name="trash"
          size={25}
          color="#97DFFC"
        />
      </Pressable>
    </View>
  );
};

export default Friend;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(151, 223, 252, 0.17)",
    borderColor: "#361866",
    borderRadius: 15,
    padding: 10,
    paddingLeft: 14,
    width: "100%",
    margin: 2,
    height: windowHeight * 0.1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePic: {
    width: "100%",
    height: "100%",
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileTextContainer: {
    flexDirection: "column",
    maxWidth: windowWidth * 0.75,
  },
  username: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
  recentMessageContainer: {
    marginTop: 2,
    paddingLeft: 5,
    maxWidth: windowWidth * 0.75,
  },
  recentMessage: {
    fontSize: 14,
    color: "grey",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: -8,
    bottom: 20,
    width: windowWidth * 0.1,
    height: "50%",
    justifyContent: "center",
    top: 0,
  },
});
