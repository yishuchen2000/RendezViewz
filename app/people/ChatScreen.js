import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Text, Button, StyleSheet } from "react-native";
import {
  Bubble,
  GiftedChat,
  Send,
  InputToolbar,
} from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import supabase from "../../Supabase";
import Feather from "@expo/vector-icons/Feather";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const { id, username, profilePic, currentUserID } = route.params;

  const handleRecordInserted = (payload) => {
    // console.log("PAYLOAD", payload);
    const newMessage = {
      _id: payload.new.id, // unique message id
      text: payload.new.msg,
      createdAt: new Date(payload.new.date),
      user: {
        _id: payload.new.from == currentUserID ? 1 : 2, // id of the sender
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
        .or(`from.eq.${id},from.eq./${currentUserID}`)
        .or(`to.eq.${id},to.eq.${currentUserID}`)
        .order("date", { ascending: false });
      // console.log("these are all messages", messages.data);

      if (messages.data) {
        setMessages([
          ...messages.data.map((message) => {
            return {
              _id: message.id, // unique id of the
              text: message.msg,
              createdAt: new Date(message.date),
              user: {
                _id: message.from == currentUserID ? 1 : 2, // id from the user
                name: username,
                avatar: profilePic,
              },
            };
          }),
        ]);
        // console.log("messages fetched from supabase in new form", messages);
      }
    };
    fetchMessages();
  }, []);

  const onSend = async (messages) => {
    // console.log("SENT", messages[0].createdAt);
    const uploadMessage = await supabase.from("messages").insert({
      date: messages[0].createdAt,
      msg: messages[0].text,
      from: currentUserID,
      to: id,
    });
    // console.log("INSERT MESSAGE", uploadMessage);
  };

  // The send button
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
          }}
        >
          <FontAwesome name="send" size={20} color="#97DFFC" />
        </Send>
      </View>
    );
  };

  // The text bubble
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "rgba(151, 223, 252, 0.5)",
          },
          left: {
            backgroundColor: "rgba(151, 223, 252, 0.5)",
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
      />
    );
  };

  // the input bar
  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
        renderActions={() => (
          <View
            style={{
              height: 44,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <Feather name="calendar" size={24} color="#97DFFC" />
          </View>
        )}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };

  return (
    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.background}>
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
      />
    </LinearGradient>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "transparent",
    // backgroundImage: "linear-gradient(to bottom, #361866, #E29292)",
    paddingTop: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  composer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 8,
    fontSize: 16,
    marginVertical: 4,
    paddingTop: 8,
  },
});
