import { useState } from "react";
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
} from "react-native";
import supabase from "../Supabase";
import { AntDesign } from "@expo/vector-icons";
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
  Caladea_italic,
} from "@expo-google-fonts/imperial-script";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AppLoading from "expo-app-loading";

const LIKE_ICON_OUTLINE = require("../assets/like_regular_purple.png");
const LIKE_ICON_FILLED = require("../assets/like_solid_purple.png");

// const LIKE_ICON_OUTLINE = <AntDesign name="hearto" size={24} color="black" />;
// const LIKE_ICON_FILLED = <AntDesign name="heart" size={24} color="black" />;

const Post = ({
  id,
  user,
  timestamp,
  text,
  liked,
  imageUrl,
  profilePic,
  action,
  comments,
}) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [inputText, setInputText] = useState("");

  const onLikePressed = async () => {
    const response = await supabase
      .from("posts")
      .update({ liked: !liked })
      .eq("id", id);
    console.log(response);
  };

  const onCommentSend = async () => {
    if (inputText !== "") {
      const response = await supabase
        .from("posts")
        .update({ comments: [...comments, ["Yishu C", inputText]] })
        .eq("id", id);
      console.log(response);
      setInputText("");
    }
  };

  // const [fontsLoaded] = useFonts({
  //   CaladeaRegular: Caladea_400Regular,
  //   CaladeaBold: Caladea_700Bold,
  //   CaladeaItalic: Caladea_italic,
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
    // <LinearGradient
    //   colors={["white", "rgba(217, 217, 217, 0.4)"]}
    //   locations={[0, 0.25]}
    //   style={styles.container}
    // >
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <View style={styles.profilePicContainer}>
            <Image style={styles.profilePic} source={{ uri: profilePic }} />
          </View>

          <Text style={styles.username}>{user}</Text>
        </View>
        <Text>{timestamp}</Text>
      </View>

      {/* <View style={styles.divider} /> */}

      <View style={styles.body}>
        <View style={styles.postContent}>
          <Text style={styles.action}>{action}</Text>
          <View style={styles.contentContainer}>
            <Text style={styles.content}>{text}</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: imageUrl,
              name: "Preview",
            }}
            style={styles.image}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.commentBar}>
          <View style={styles.textInput}>
            <TextInput
              style={styles.inputText}
              value={inputText}
              onChangeText={(text) => setInputText(text)}
              placeholder={"Write a comment..."}
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
            />
            <TouchableOpacity style={styles.send} onPress={onCommentSend}>
              <FontAwesome name="send" size={20} color="#361866" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onLikePressed}>
            <Image
              style={styles.heart}
              source={liked ? LIKE_ICON_FILLED : LIKE_ICON_OUTLINE}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.commentSection}>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <Text style={styles.comment}>{item[0] + ": " + item[1]}</Text>
            )}
            style={styles.flatList}
          />
        </View>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(217, 217, 217, 0.8)",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 15,
    padding: 8,
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
    backgroundColor: "rgba(217, 217, 217, 1)",
    borderRadius: 15,
    padding: 6,
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputText: {
    // color: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    flex: 1,
    // borderWidth: 1,
    // borderColor: "#361866",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 5,
    gap: 8,
    // borderWidth: 1,
  },
  footer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    // borderWidth: 1,
  },
  commentBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "rgba(217, 217, 217, 0.5)",
    // flex: 1,
    // borderWidth: 1,
  },
  commentSection: {
    // borderWidth: 1,
    width: "100%",
    padding: 5,

    // height: 1,
  },
  comment: {
    color: "rgba(0, 0, 0, 0.7)",
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
    width: 32,
    height: 32,
    margin: 5,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    // fontFamily: "CaladeaRegular",
  },
  imageContainer: {
    width: 60,
    height: 90,
    // aspectRatio: 1,
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "red",
  },
  content: {
    // borderWidth: 1,
    alignItems: "center",
    fontSize: 20,
    // textAlign: "center",
  },
});
