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
} from "react-native";
import supabase from "../Supabase";
import {
  useFonts,
  Caladea_400Regular,
  Caladea_700Bold,
  Caladea_italic,
} from "@expo-google-fonts/imperial-script";

import AppLoading from "expo-app-loading";

const LIKE_ICON_OUTLINE = require("../assets/like_regular_light.png");
const LIKE_ICON_FILLED = require("../assets/like_solid_light.png");

const Post = ({
  id,
  user,
  timestamp,
  text,
  liked,
  imageUrl,
  profilePic,
  action,
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

  // const [fontsLoaded] = useFonts({
  //   CaladeaRegular: Caladea_400Regular,
  //   CaladeaBold: Caladea_700Bold,
  //   CaladeaItalic: Caladea_italic,
  // });

  // if (!fontsLoaded) {
  //   return <AppLoading />;
  // }

  return (
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
        <View style={styles.textInput}>
          <TextInput
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            placeholder={"Write a comment..."}
          />
        </View>
        <TouchableOpacity onPress={onLikePressed}>
          <Image
            style={styles.heart}
            source={liked ? LIKE_ICON_FILLED : LIKE_ICON_OUTLINE}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(217, 217, 217, 0.5)",
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
    width: 20,
    height: 18,
  },
  textInput: {
    // opacity: "20%",
    backgroundColor: "rgba(217, 217, 217, 0.5)",
    borderRadius: 15,
    padding: 8,
    flex: 1,
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
