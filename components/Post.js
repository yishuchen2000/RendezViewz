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
  SafeAreaView,
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
  const [showComment, setshowComment] = useState(false);

  const onLikePressed = async () => {
    const response = await supabase
      .from("posts")
      .update({ liked: !liked })
      .eq("id", id);
    console.log(response);
  };

  const onCommentSend = async () => {
    if (inputText !== "") {
      const url =
        "https://enpuyfxhpaelfcrutmcy.supabase.co/storage/v1/object/public/rendezviewz/people/me.png";
      const response = await supabase
        .from("posts")
        .update({ comments: [...comments, ["Yishu C", inputText, url, true]] })
        .eq("id", id);
      console.log(response);
      setInputText("");
    }
  };

  const onDeleteComment = async (index) => {
    const response = await supabase
      .from("posts")
      .update({
        comments: [...comments.slice(0, index), ...comments.slice(index + 1)],
      })
      .eq("id", id);
    console.log(response);
  };

  const onCloseComment = async () => {
    setshowComment(false);
  };

  const onShowComment = async () => {
    setshowComment(true);
  };

  if (!showComment) {
    contentDisplayed = (
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
                placeholderTextColor="rgba(0, 0, 0, 0.6)"
              />
              <TouchableOpacity style={styles.send} onPress={onCommentSend}>
                <FontAwesome name="send" size={18} color="#361866" />
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
            <TouchableOpacity
              style={styles.closeComment}
              onPress={onShowComment}
            >
              <AntDesign name="down" size={18} color="rgba(0, 0, 0, 0.5)" />
              <Text style={styles.close}>show comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  } else {
    contentDisplayed = (
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
                placeholderTextColor="rgba(0, 0, 0, 0.4)"
              />
              <TouchableOpacity style={styles.send} onPress={onCommentSend}>
                <FontAwesome name="send" size={18} color="#361866" />
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
              renderItem={({ item, index }) => (
                <View style={styles.oneComment}>
                  <View style={styles.leftContent}>
                    <View style={styles.commentAvatar}>
                      <Image
                        style={styles.profilePic}
                        source={{ uri: item[2] }}
                      />
                    </View>

                    <View style={styles.commentText}>
                      <Text style={styles.userName}>{item[0]}</Text>
                      <Text style={styles.comment}>{item[1]}</Text>
                    </View>
                  </View>

                  {item[3] === "true" ? (
                    <View style={styles.delete}>
                      <TouchableOpacity
                        style={styles.delete}
                        onPress={() => onDeleteComment(index)}
                      >
                        <AntDesign name="close" size={18} color="gray" />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
              style={styles.flatList}
            />
            <TouchableOpacity
              style={styles.closeComment}
              onPress={onCloseComment}
            >
              <AntDesign name="up" size={18} color="rgba(0, 0, 0, 0.4)" />
              <Text style={styles.close}>close comments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return <SafeAreaView>{contentDisplayed}</SafeAreaView>;
};

export default Post;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(217, 217, 217, 0.6)",
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
    backgroundColor: "rgba(217, 217, 217, 0.6)",
    borderRadius: 15,
    padding: 6,
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputText: {
    width: "90%",
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
  closeComment: {
    // borderWidth: 1,
    flexDirection: "row", // To display items horizontally
    justifyContent: "flex-end",
    marginTop: 4,
  },
  oneComment: {
    // borderWidth: 1,
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
    // borderWidth: 1,
    marginRight: 5,
    marginTop: 3,
  },
  commentText: {
    // borderWidth: 1,
    width: "80%",
  },
  userName: {
    fontWeight: "bold",
    fontSize: 13,
  },
  comment: {
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: 16,
    // borderWidth: 1,
  },
  delete: {
    // borderWidth: 1,
  },
  close: {
    // borderWidth: 1,
    color: "rgba(0, 0, 0, 0.7)",
    textAlign: "right",
    // borderWidth: 1,
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
    width: 35,
    height: 35,
    margin: 5,
    marginRight: 8,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 15,
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
