import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, StyleSheet, Text, Image } from "react-native";
import {
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
  Avatar,
} from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import supabase from "../../Supabase";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const { id, username, profilePic, currentUserID } = route.params;

  const navigation = useNavigation();

  const [profileData, setProfileData] = useState(null);
  const [rankedNumber, setRankedNumber] = useState(0);
  const [wishlistNumber, setWishlistNumber] = useState(0);
  const [friendNumber, setFriendNumber] = useState(null);
  const [myPostData, setMyPostData] = useState(null);

  const [isFollowed, setIsFollowed] = useState(false);

  const [numbersFetched, setNumbersFetched] = useState(false);
  const [infoFetched, setInfoFetched] = useState(false);

  useEffect(() => {
    // console.log("id info in profile!", session.user.id);
    const fetchData = async () => {
      const profileInfo = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id);

      // console.log("PROFILE IN FRIEND", profileInfo.data);
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

      setInfoFetched(true);
    };
    fetchData();
  }, []);

  const goToAddEvent = () => {
    // navigation.navigate("messages", {
    //   screen: "AddEvent",
    // });
    navigation.navigate("AddEvent");
  };

  const handleRecordInserted = (payload) => {
    const newMessage = {
      _id: payload.new.id,
      text: payload.new.msg,
      createdAt: new Date(payload.new.date),
      user: {
        _id: payload.new.from == currentUserID ? 1 : 2,
        name: username,
        avatar: profilePic,
      },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessage)
    );
  };

  useEffect(() => {
    supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleRecordInserted
      )
      .subscribe();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await supabase
        .from("messages")
        .select("*")
        .or(`from.eq.${id},from.eq.${currentUserID}`)
        .or(`to.eq.${id},to.eq.${currentUserID}`)
        .order("date", { ascending: false });
      if (messages.data) {
        setMessages([
          ...messages.data.map((message) => {
            return {
              _id: message.id,
              text: message.msg,
              createdAt: new Date(message.date),
              user: {
                _id: message.from == currentUserID ? 1 : 2,
                name: username,
                avatar: profilePic,
              },
            };
          }),
        ]);
      }
    };
    fetchMessages();
  }, []);

  const onSend = async (messages) => {
    const uploadMessage = await supabase.from("messages").insert({
      date: messages[0].createdAt,
      msg: messages[0].text,
      from: currentUserID,
      to: id,
    });
  };

  const renderSend = (props) => {
    return (
      <View>
        <Send
          {...props}
          containerStyle={{
            height: 44,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
            marginLeft: 6,
            backgroundColor: "rgba(255, 255, 255, 0)",
            marginBottom: 5,
          }}
        >
          <FontAwesome name="send" size={20} color="#97DFFC" />
        </Send>
      </View>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "rgba(151, 223, 252, 0.5)",
          },
          left: {
            backgroundColor: "rgba(151, 223, 252, 0.2)",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
          left: {
            color: "#fff",
          },
        }}
        timeTextStyle={{
          right: {
            color: "#ccc", // Same shade as the left messages
          },
          left: {
            color: "#999",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      // <InputToolbar
      //   {...props}
      //   containerStyle={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      // />
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.3)",
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <Pressable
          style={styles.headerCenter}
          onPress={() => {
            navigation.navigate("FriendProfile", {
              id: id,
              friendNumber: friendNumber,
              myPostData: myPostData,
              profileData: profileData,
              rankedNumber: rankedNumber,
              wishlistNumber: wishlistNumber,
            });
          }}
        >
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          <Text style={styles.username}>{username}</Text>
        </Pressable>

        <Pressable onPress={goToAddEvent} style={styles.calendarIcon}>
          <Feather name="calendar" size={28} color="#fff" />
        </Pressable>
      </View>
    );
  };

  const renderAvatar = (props) => {
    return (
      <Avatar
        {...props}
        onPressAvatar={() => {
          console.log(profileData);
          navigation.navigate("FriendProfile", {
            id: id,
            friendNumber: friendNumber,
            myPostData: myPostData,
            profileData: profileData,
            rankedNumber: rankedNumber,
            wishlistNumber: wishlistNumber,
          });
        }}
        containerStyle={{ left: styles.avatar }}
        imageStyle={{ left: styles.avatarImage }}
      />
    );
  };

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.background}>
      {renderHeader()}
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderInputToolbar={renderInputToolbar}
        textInputProps={styles.composer}
        bottomOffset={80}
        minInputToolbarHeight={52} // Adjust this value as needed to give space between the last message and the text input
      />
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
    paddingHorizontal: 10,
    borderBottomWidth: 0.2,
    borderBottomColor: "rgba(255, 255, 255, 0.4)",
  },
  headerCenter: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    paddingBottom: 10,
  },
  avatar: {
    borderWidth: 1,
    borderColor: "white",
  },
  calendarIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  composer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    fontSize: 16,
    marginVertical: 8,
    marginBottom: 10,
    paddingVertical: 8,
    maxHeight: 140, // Set a maximum height for the text input
    marginLeft: 5,
  },
  avatar: {
    marginRight: 0, // Ensure this doesn't add extra space
  },
  avatarImage: {
    borderRadius: 15,
  },
});
