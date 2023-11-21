import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  FlatList,
  TextInput,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import Comment from "./components/Comment";
import supabase from "./Supabase";
import { FontAwesome } from "@expo/vector-icons";

import * as Font from "expo-font";

export default function App() {
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "imperial-script": require("./assets/fonts/ImperialScript.ttf"),
      });
    }
    loadFont();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
