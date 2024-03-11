import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import supabase from "../Supabase";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import getMovieDetails from "./getMovieDetails";
// import getUserInfo from "./getUserInfo";

const LIKE_ICON_OUTLINE = require("../assets/like_regular_purple.png");
const LIKE_ICON_FILLED = require("../assets/like_solid_purple.png");

const Comment = ({ onDeleteComment, sessionID, id, text }) => {
  const [username, setUsername] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const navigation = useNavigation();
  //   console.log(id);
  //   console.log(text);

  useEffect(() => {
    const getUserInfo = async () => {
      const profileInfo = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);

      console.log("PROFILE INFO FROM COMP", profileInfo);
      setProfilePic(profileInfo.data[0].avatar_url);
      setUsername(profileInfo.data[0].username);
    };

    getUserInfo();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const details = await getMovieDetails(title);
  //     setMovieDetails(details);
  //     setIsLoading(false);

  //     const profileInfo = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", id);

  //     console.log("PROFILE IN FRIEND", profileInfo.data);
  //     setProfileData(profileInfo.data);

  //     let friendNumber = profileInfo.data[0]["friend_ids"]
  //       ? profileInfo.data[0]["friend_ids"].length
  //       : 0;
  //     // console.log("FRIEND NUMBER", friendNumber);
  //     setFriendNumber(friendNumber);

  //     const myPosts = await supabase
  //       .from("posts")
  //       .select("*")
  //       .eq("user_id", id);
  //     setMyPostData(myPosts.data);
  //     // console.log("POST", myPosts.data);

  //     const rankings = await supabase
  //       .from("rankings")
  //       .select("*", { count: "exact", head: true })
  //       .eq("user_id", id);

  //     const wishlist = await supabase
  //       .from("wishlist")
  //       .select("*", { count: "exact", head: true })
  //       .eq("user_id", id);

  //     setRankedNumber(rankings.count);
  //     setWishlistNumber(wishlist.count);

  //     setInfoFetched(true);
  //   };
  //   fetchData();
  // }, [title]);

  //   const getTimeDifference = (timestamp) => {
  //     const currentTime = new Date();
  //     const postTime = new Date(timestamp);
  //     const timeDifference = Math.abs(currentTime - postTime);

  //     const seconds = Math.floor(timeDifference / 1000);
  //     const minutes = Math.floor(seconds / 60);
  //     const hours = Math.floor(minutes / 60);
  //     const days = Math.floor(hours / 24);

  //     if (seconds < 60) {
  //       return "now";
  //     } else if (minutes < 60) {
  //       return `${minutes}m ago`;
  //     } else if (hours < 24) {
  //       return `${hours}h ago`;
  //     } else {
  //       return `${days}d ago`;
  //     }
  //   };

  //   const formattedTime = getTimeDifference(timestamp);

  return (
    <View style={styles.oneComment}>
      <View style={styles.leftContent}>
        <View style={styles.commentAvatar}>
          <Image style={styles.profilePic} source={{ uri: profilePic }} />
        </View>

        <View style={styles.commentText}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.comment}>{text}</Text>
        </View>
      </View>

      {sessionID === id ? (
        <View style={styles.delete}>
          <TouchableOpacity
            style={styles.delete}
            onPress={() => {
              Alert.alert(
                "Delete Comment?",
                `Are you sure you want to remove this comment?`,

                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: onDeleteComment,
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <AntDesign name="close" size={18} color="white" />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(151, 223, 252, 0.17)",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 15,
    padding: 7,
    width: "100%",
    marginBottom: 10,
    gap: 4,
    textColor: "black",
  },
  heart: {
    width: 24,
    height: 22,
  },
  textInput: {
    // opacity: "20%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 15,
    padding: 9,
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputText: {
    width: "90%",
    color: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    // borderColor: "#361866",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  formattedTime: {
    color: "white",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 5,
    gap: 8,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  commentBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "rgba(217, 217, 217, 0.5)",
    // flex: 1,
  },
  commentSection: {
    width: "100%",
    padding: 5,
  },
  closeComment: {
    flexDirection: "row", // To display items horizontally
    justifyContent: "flex-end",
    marginTop: 4,
  },
  oneComment: {
    flexDirection: "row", // To display items horizontally
    justifyContent: "space-between",
    alignItems: "center",
    margin: 4,
  },
  leftContent: {
    flexDirection: "row",
    // alignItems: "center",
  },
  commentAvatar: {
    width: 30,
    height: 30,
    marginRight: 5,
    marginTop: 3,
  },
  commentText: {
    width: "80%",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 13,
    color: "white",
  },
  comment: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  delete: {},
  close: {
    // borderWidth: 1,
    color: "white",
    textAlign: "right",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: 50, // Assuming it's a circle
    zIndex: 2, // Make sure it's above the background
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    margin: 5,
    marginRight: 8,
    position: "relative",
  },
  profilePicBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 50, // Assuming it's a circle
    backgroundColor: "#858AE3",
    zIndex: 1,
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
    // fontFamily: "CaladeaRegular",
    color: "white",
  },
  imageContainer: {
    width: 60,
    height: 90,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  postContent: {
    flex: 1,
  },
  action: {
    fontStyle: "italic",
    // borderWidth: 1,
    color: "white",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    fontSize: 20,
    // textAlign: "center",
    color: "white",
  },
});
