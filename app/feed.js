import { StyleSheet, Text, View } from "react-native";
//hearts
import { Ionicons } from "@expo/vector-icons";
//group
import { FontAwesome } from "@expo/vector-icons";
//cal1
import { FontAwesome5 } from "@expo/vector-icons";
//cal5
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";

import { Link } from "expo-router";

export default function Page() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Feed</Text>
        <Ionicons name="heart-sharp" size={24} color="black" />
        <Ionicons name="heart-outline" size={24} color="black" />
        <AntDesign name="heart" size={24} color="black" />
        <AntDesign name="hearto" size={24} color="black" />
        <FontAwesome name="group" size={24} color="black" />
        <FontAwesome5 name="calendar-day" size={24} color="black" />
        <FontAwesome name="calendar-o" size={24} color="black" />
        <FontAwesome name="calendar" size={24} color="black" />
        <FontAwesome5 name="calendar-alt" size={24} color="black" />
        <AntDesign name="calendar" size={24} color="black" />
        <FontAwesome5 name="comment-alt" size={24} color="black" />
        <Foundation name="comment" size={24} color="black" />
        <MaterialCommunityIcons
          name="comment-multiple-outline"
          size={24}
          color="black"
        />
        <MaterialCommunityIcons name="comment" size={24} color="black" />
        <MaterialIcons name="mode-comment" size={24} color="black" />
        <Feather name="send" size={24} color="black" />
        <FontAwesome name="send" size={24} color="black" />
        <Feather name="inbox" size={24} color="black" />
        <FontAwesome name="inbox" size={24} color="black" />
        <Ionicons name="add-circle" size={24} color="black" />
        <Ionicons name="add-circle-outline" size={24} color="black" />
        <MaterialIcons name="add" size={24} color="black" />
        <MaterialIcons name="library-add" size={24} color="black" />
        <Octicons name="diff-added" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
