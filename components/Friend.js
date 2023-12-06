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

const Friend = ({ id, user, profilePic }) => {
  const [inputText, setInputText] = useState("");

  return (
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
    </View>
  );
};

export default Friend;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(225, 225, 225, 0.3)",
    borderColor: "#361866",
    //borderWidth: 0.5,
    // height: 70,
    borderRadius: 15,
    padding: 8,
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
    width: 32,
    height: 32,
    margin: 5,
    marginRight: 8,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "bold",
    // fontFamily: "CaladeaRegular",
  },
});
