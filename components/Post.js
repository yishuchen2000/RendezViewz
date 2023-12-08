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

const LIKE_ICON_OUTLINE = require("../assets/like_regular_purple.png");
const LIKE_ICON_FILLED = require("../assets/like_solid_purple.png");

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

  const getTimeDifference = (timestamp) => {
    const currentTime = new Date();
    const postTime = new Date(timestamp);
    const timeDifference = Math.abs(currentTime - postTime);

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "now";
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const formattedTime = getTimeDifference(timestamp);

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
          <Text>{formattedTime}</Text>
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
    // borderColor: "#361866",
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
  },
  comment: {
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: 16,
  },
  delete: {},
  close: {
    color: "rgba(0, 0, 0, 0.7)",
    textAlign: "right",
  },
  profilePic: {
    width: "100%",
    height: "100%",
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
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    fontSize: 20,
  },
});
