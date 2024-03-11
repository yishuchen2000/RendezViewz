import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Pressable,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute } from "@react-navigation/native";
import ProfilePost from "../../components/ProfilePost";
import { useNavigation } from "@react-navigation/native";
import { EvilIcons } from "@expo/vector-icons";

import supabase from "../../Supabase";
import Ranking from "../../components/friendRanking";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function FriendProfile() {
  const navigation = useNavigation();
  // const [data, setData] = useState([]);

  // const [userID, setUserID] = useState(null);
  const route = useRoute();
  const {
    id,
    friendNumber,
    myPostData,
    profileData,
    rankedNumber,
    wishlistNumber,
  } = route.params;
  console.log("USER_IDin FriendProfile", id);
  // console.log("friendNUMBER", friendNumber);
  // console.log("myPostData", myPostData);
  // console.log("profileData", profileData);
  const [isFollowed, setIsFollowed] = useState(false);

  // if (!numbersFetched || !infoFetched) {
  // return (
  //   <LinearGradient
  //     colors={["#361866", "#E29292"]}
  //     style={[styles.container, { paddingHorizontal: 8 }]}
  //   >
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="purple" />
  //       <Text style={{ color: "white" }}>Loading...</Text>
  //     </View>
  //   </LinearGradient>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0e0111", "#311866"]}
        style={[styles.container, { paddingHorizontal: 8 }]}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            {/* <Pressable onPress={accountPage} style={styles.titleBar}>
              <FontAwesome name="gear" size={24} color="white" />
            </Pressable> */}

            <View style={styles.centeredView}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: profileData[0].avatar_url,
                  }}
                  style={styles.profileImage}
                />
                {/* <Pressable
                  style={styles.cameraIcon}
                  onPress={() => console.log("Camera icon pressed")}
                >
                  <EvilIcons name="camera" size={24} color="black" />
                </Pressable> */}
              </View>
            </View>

            <View style={styles.statsContainer}>
              <Pressable
                style={styles.statsBox}
                onPress={() => {
                  navigation.popToTop();
                  navigation.navigate("people", {
                    screen: "Friend Movies",
                    params: {
                      screen: "Friend Rankings",
                      params: { id: id },
                    },
                  });
                }}
              >
                <View style={styles.statsBox}>
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {rankedNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Ranked</Text>
                </View>
              </Pressable>
              <Text style={[styles.text, { fontWeight: "400", fontSize: 28 }]}>
                {profileData[0].username}
              </Text>
              <View
                style={[
                  styles.statsBox,
                  {
                    // borderColor: "white",
                    // borderLeftWidth: 1,
                    // borderRightWidth: 1,
                  },
                ]}
              >
                <Pressable
                  style={[styles.statsBox]}
                  // onPress={() => navigation.navigate("people")}
                >
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {friendNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Friends</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            {/* <Pressable
              style={[styles.button, styles.followButton]}
              // onPress={toggleFollow}
            >
              <Text style={[styles.text, styles.followButtonText]}>
                {isFollowed ? "Added" : "Add"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.messageButton]}
              // onPress={() => console.log("Message button pressed")}
            >
              <Text style={[styles.text, styles.messageButtonText]}>
                Rankings
              </Text>
            </Pressable> */}
          </View>
          <Text style={[styles.subText, styles.recent]}>About</Text>
          <View style={styles.rectangleContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.rectangleText}>
                <Text style={styles.rectangleText}>{profileData[0].info}</Text>
              </Text>
            </View>
            <View style={styles.centerContainer}>
              <View style={styles.rectangleLine} />
            </View>
            <View style={styles.rightContainer}>
              <View style={styles.wishlistInfo}>
                <Pressable
                  style={styles.statsBox}
                  // onPress={() =>
                  //   navigation.navigate("Friend Movies", {
                  //     screen: "Friend Wishlist",
                  //     params: { id: id },
                  //   })
                  // }
                >
                  <Text style={[styles.text, { fontSize: 18 }]}>
                    {wishlistNumber}
                  </Text>
                  <Text style={[styles.text, styles.subText]}>Wishlist</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <View style={styles.postBar}>
              <Text style={[styles.subText, styles.recent]}>Posts</Text>
              {myPostData.map((item) => (
                <ProfilePost
                  profileData={profileData}
                  key={item.id}
                  id={item.id}
                  user={item.user}
                  timestamp={item.created_at}
                  text={item.text}
                  liked={item.liked}
                  imageUrl={item.show_poster_url}
                  profilePic={item.profile_pic}
                  action={item.action}
                  comments={item.comments}
                  title={item.movie_title}
                  goesTo={"ShowDetails"}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    borderColor: "red",
    flex: 0.5,
  },
  info: {
    borderColor: "green",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBotton: 20,
  },
  followButtonText: {
    color: "#0E0111",
    fontWeight: "bold",
    fontSize: 18,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  followButton: {
    backgroundColor: "#858AE3",
    width: 120,
    marginRight: 20,
  },
  messageButton: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#97DFFC",
    width: 120,
    marginLeft: 20,
  },
  messageButtonText: {
    color: "#97DFFC",
    fontWeight: "bold",
    fontSize: 18,
  },
  rectangleContainer: {
    marginTop: 10,
    backgroundColor: "#97DFFC33",
    borderRadius: 40,
    paddingHorizontal: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    flex: 2,
    justifyContent: "center",
    paddingLeft: 10,
  },
  centerContainer: {
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 5,
    paddingRight: 10,
  },
  rectangleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  rectangleLine: {
    width: 3,
    backgroundColor: "#858AE3",
    height: "30%",
    alignSelf: "center",
  },
  wishlistInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  postBar: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  text: {
    color: "white",
  },
  titleBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 0.32,
  },
  linearGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    // borderWidth: 1,
    // borderColor: "white",
    alignItems: "center",
    paddingTop: 32,
    justifyContent: "center",
    flex: 1,
  },
  profileImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 6,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.4,
    marginTop: 20,
  },
  statsBox: {
    alignItems: "center",
    flex: 1,
  },
  subText: {
    fontSize: 12,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  recent: {
    marginLeft: 12,
    marginTop: 5,
    marginBottom: 6,
    fontSize: 18,
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
});

//   return (
//     <SafeAreaView style={styles.container}>
//       <LinearGradient
//         colors={["#361866", "#E29292"]}
//         style={[styles.container, { paddingHorizontal: 8 }]}
//       >
//         <View style={styles.header}>
//           <View style={styles.centeredView}>
//             <View style={styles.profileImageContainer}>
//               <Image
//                 source={{
//                   uri: profileData[0].avatar_url,
//                 }}
//                 style={styles.profileImage}
//               />
//             </View>
//           </View>

//           <View style={styles.infoContainer}>
//             <Text style={[styles.text, { fontWeight: "400", fontSize: 28 }]}>
//               {profileData[0].username}
//             </Text>
//           </View>

//           <View style={styles.statsContainer}>
//             <Pressable
//               style={styles.statsBox}
//               onPress={() => navigation.navigate("rankings")}
//             >
//               <View style={styles.statsBox}>
//                 <Text style={[styles.text, { fontSize: 18 }]}>
//                   {rankedNumber}
//                 </Text>
//                 <Text style={[styles.text, styles.subText]}>Ranked</Text>
//               </View>
//             </Pressable>

//             <View
//               style={[
//                 styles.statsBox,
//                 {
//                   borderColor: "white",
//                   borderLeftWidth: 1,
//                   borderRightWidth: 1,
//                 },
//               ]}
//             >
//               <Pressable
//                 style={[styles.statsBox]}
//                 // onPress={() => navigation.navigate("people")}
//               >
//                 <Text style={[styles.text, { fontSize: 18 }]}>
//                   {friendNumber}
//                 </Text>
//                 <Text style={[styles.text, styles.subText]}>Friends</Text>
//               </Pressable>
//             </View>

//             <View style={styles.statsBox}>
//               <Pressable
//                 style={styles.statsBox}
//                 // onPress={() =>
//                 //   navigation.navigate("rankings", { screen: "My Wishlist" })
//                 // }
//               >
//                 <Text style={[styles.text, { fontSize: 18 }]}>
//                   {wishlistNumber}
//                 </Text>
//                 <Text style={[styles.text, styles.subText]}>Wishlist</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>

//         <View style={styles.buttonsContainer}>
//           {/* <Pressable
//             style={[styles.button, styles.followButton]}
//             // onPress={setIsFollowed(!isFollowed)}
//           >
//             <Text style={[styles.text, styles.followButtonText]}>
//               {isFollowed ? "Added" : "Add"}
//             </Text>
//           </Pressable>
//           <Pressable
//             style={[styles.button, styles.messageButton]}
//             onPress={() => console.log("Message button pressed")}
//           >
//             <Text style={[styles.text, styles.messageButtonText]}>
//               Rankings
//             </Text>
//           </Pressable> */}
//         </View>

//         <View style={styles.info}>
//           <View style={styles.postBar}>
//             <Text style={[styles.subText, styles.recent]}>Posts</Text>
//             {/* <View style={styles.scroll}> */}
//             <ScrollView style={styles.scroll} horizontal={false}>
//               {myPostData.map((item) => (
//                 <ProfilePost
//                   key={item.id}
//                   id={item.id}
//                   user={item.user}
//                   timestamp={item.created_at}
//                   text={item.text}
//                   liked={item.liked}
//                   imageUrl={item.show_poster_url}
//                   profilePic={item.profile_pic}
//                   action={item.action}
//                   comments={item.comments}
//                   title={item.movie_title}
//                   goesTo={"ShowDetails"}
//                 />
//               ))}
//             </ScrollView>
//           </View>
//         </View>
//         <View style={styles.clapboard}>
//           <Image
//             source={require("../../assets/Clapboard2.png")}
//             style={{
//               flex: 1,
//               width: windowWidth,
//               resizeMode: "stretch",
//             }}
//           />
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// }
// // }

// const styles = StyleSheet.create({
//   header: {
//     borderColor: "red",
//     flex: 0.6,
//   },
//   info: {
//     borderColor: "green",
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     // Adjust padding if needed, for example:
//     paddingTop: 10,
//   },
//   button: {
//     paddingVertical: 8, // Adjust as needed
//     paddingHorizontal: 16, // Adjust as needed
//     borderRadius: 5, // Adjust as needed
//     // Common button styles
//     justifyContent: "center",
//     alignItems: "center",
//     minWidth: 110, // Adjust the width as needed
//     paddingHorizontal: 16,
//   },
//   followButton: {
//     textAlign: "center",
//     backgroundColor: "#361866", // Yellow color for the Follow button
//     //marginRight: 10, // Adjust the space between buttons as needed
//     width: 100,
//   },
//   followButtonText: {
//     color: "white", // Dark blue color for the Follow text
//     fontWeight: "bold", // Adjust as needed
//     // Other text styles as needed
//   },
//   messageButton: {
//     backgroundColor: "rgba(255, 255, 255, 0.3)", // Dark blue color for the Message button
//   },
//   messageButtonText: {
//     color: "white", // Light blue color for the Message text
//     fontWeight: "bold", // Adjust as needed
//     // Other text styles as needed
//   },
//   postBar: {
//     flex: 1,
//   },
//   activityBar: {
//     flex: 1,
//   },
//   scroll: {
//     flex: 1,
//   },
//   text: {
//     color: "white",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "500",
//     color: "white",
//   },
//   new: {
//     alignItems: "center",
//   },
//   image: {
//     flex: 1,
//     // resizeMode: "contain",
//     // width: 100,
//     // height: 100,
//     maxWidth: "100%", // Maximum width as the container's width
//     maxHeight: "100%", // Maximum height as the container's height
//     resizeMode: "contain",
//   },
//   titleBar: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     // marginTop: 24,
//     // marginHorizontal: 16,
//     // marginBottom: -32,
//     // borderWidth: 1,
//     flex: 0.32,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   linearGradient: {
//     flex: 1,
//     justifyContent: "center", // Center vertically in the safe area view
//     alignItems: "center", // Center horizontally
//   },
//   centeredView: {
//     alignItems: "center", // Ensure content is centered horizontally
//     justifyContent: "center", // Ensure content is centered vertically
//     flex: 1, // Take up all available space
//   },
//   profileImageContainer: {
//     position: "relative",
//     width: 120, // Adjust based on your profile image size
//     height: 120,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   profileImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 75, // Adjust this value to match half of the width/height to make it round
//   },
//   cameraIcon: {
//     position: "absolute",
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(255,255,255,0.6)", // Slight background to make it visible on any background
//     padding: 6,
//     borderRadius: 12, // Rounded corners for the icon's background
//   },
//   infoContainer: {
//     alignSelf: "center",
//     alignItems: "center",
//     justifyContent: "center",
//     // marginTop: 12,
//     flex: 0.3,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     // alignSelf: "center",
//     // marginTop: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     flex: 0.4,
//   },
//   statsBox: {
//     alignItems: "center",
//     flex: 1,
//   },
//   subText: {
//     fontSize: 12,
//     color: "white",
//     textTransform: "uppercase",
//     fontWeight: "500",
//   },
//   mediaImageContainer: {
//     width: 150,
//     height: 150,
//     borderRadius: 12,
//     overflow: "hidden",
//     marginHorizontal: 10,
//   },
//   recent: {
//     marginLeft: 12,
//     marginTop: 5,
//     marginBottom: 6,
//     fontSize: 18,
//   },
//   recentItemCard: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 8,
//     // flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     borderRadius: 10,
//   },
//   activityIndicator: {
//     backgroundColor: "white",
//     padding: 4,
//     height: 12,
//     width: 12,
//     borderRadius: 6,
//     marginTop: 3,
//     marginRight: 20,
//   },
//   boldName: {
//     fontWeight: "500",
//   },
//   clapboard: {
//     // position: "abolute",
//     // bottom: windowHeight * 0.015,
//     height: windowHeight * 0.03,
//     width: windowWidth,
//     alignSelf: "center",
//   },
// });
