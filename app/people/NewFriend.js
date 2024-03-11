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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

// friendIDs={friendIDs}
//                 currentUserId={currentUserID}
//                   id={item.id}
//                   user={item.username}
//                   profilePic={item.avatar_url}

//id, user, profilePic, goesTo
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const NewFriend = ({ id, user, profilePic, onAddFriend, goesTo }) => {
  const navigation = useNavigation();

  const [profileData, setProfileData] = useState(null);
  const [rankedNumber, setRankedNumber] = useState(0);
  const [wishlistNumber, setWishlistNumber] = useState(0);
  const [friendNumber, setFriendNumber] = useState(null);
  const [myPostData, setMyPostData] = useState(null);

  // console.log(friendIDs, id, user, profilePic);
  // const [session, setSession] = useState(null);
  // const navigation = useNavigation();
  // const [inputText, setInputText] = useState("");

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     console.log("current Session!!!", session);
  //     setSession(session);
  //   });
  // }, []);

  useEffect(() => {
    // console.log("id info in profile!", session.user.id);
    const fetchData = async () => {
      const profileInfo = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);

      console.log("PROFILE IN FRIEND", profileInfo.data);
      setProfileData(profileInfo.data);

      let friendNumber = profileInfo.data[0]["friend_ids"]
        ? profileInfo.data[0]["friend_ids"].length
        : 0;
      // console.log("FRIEND NUMBER", friendNumber);
      setFriendNumber(friendNumber);

      const myPosts = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", id);
      setMyPostData(myPosts.data);
      // console.log("POST", myPosts.data);

      const rankings = await supabase
        .from("rankings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);

      const wishlist = await supabase
        .from("wishlist")
        .select("*", { count: "exact", head: true })
        .eq("user_id", id);

      setRankedNumber(rankings.count);
      setWishlistNumber(wishlist.count);

      // setInfoFetched(true);
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() =>
            navigation.navigate("NewFriendProfile", {
              // screen: "FriendProfile",
              id: id,
              friendNumber: friendNumber,
              myPostData: myPostData,
              profileData: profileData,
              rankedNumber: rankedNumber,
              wishlistNumber: wishlistNumber,
            })
          }
        >
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>
            <Text style={styles.username}>{user}</Text>
          </View>
        </Pressable>
        {/* <Text>{timestamp}</Text> */}
      </View>

      <Pressable style={styles.deleteButtonContainer}>
        <AntDesign
          name="adduser"
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              "Add Friend?",
              `Do you want to add ${user} as a friend?`,

              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: onAddFriend,
                },
              ],
              { cancelable: false }
            );
          }}
          size={25}
          color="#97DFFC"
        />
      </Pressable>
    </View>
  );

  return (
    <Pressable
      onPress={() => {
        Alert.alert(
          "Add Friend?",
          `Do you want to add ${user} as a friend?`,

          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: onAddFriend,
            },
          ],
          { cancelable: false }
        );
      }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            <View style={styles.profilePicContainer}>
              <Image style={styles.profilePic} source={{ uri: profilePic }} />
            </View>
            <Text style={styles.username}>{user}</Text>
          </View>
          {/* <Text>{timestamp}</Text> */}
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
            color="#602683"
          />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default NewFriend;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(151, 223, 252, 0.17)",
    borderColor: "#361866",
    //borderWidth: 0.5,
    // height: 70,
    borderRadius: 15,
    padding: 10,
    paddingLeft: 14,
    width: "100%",
    // marginBottom: 10,
    // gap: 4,
    textColor: "black",
    margin: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profilePic: {
    // width: 32,
    // height: 32,
    width: "100%",
    height: "100%",
    // marginRight: 4,
    // borderRadius: "50%",
    // borderTopRightRadius: '100%',
    // borderBottomLeftRadius: '100%'
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    // margin: 5,
    marginRight: 15,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 17,
    color: "white",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    bottom: 20,
    width: windowWidth * 0.1,
    height: "50%",
    justifyContent: "center",
  },
});
