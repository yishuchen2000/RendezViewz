import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";

import {
  useFonts,
  ImperialScript_400Regular,
} from "@expo-google-fonts/imperial-script";
import AppLoading from "expo-app-loading";

export default function HomeLayout() {
  const [fontsLoaded] = useFonts({
    ImperialScript: ImperialScript_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Tabs
      screenOptions={{
        unmountOnBlur: true,
        headerTitle: "RendezViewz",
        headerStyle: {
          backgroundColor: "#311866",
          //borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: "white",
          fontFamily: "ImperialScript",
          fontSize: 30,
        },
        tabBarStyle: { backgroundColor: "#311866", activeTintColor: "red" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#BBADD3",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="calendar-o" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          tabBarLabel: "Rankings",
          tabBarIcon: ({ size, color }) => (
            <Entypo name="add-to-list" size={size + 5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          tabBarLabel: "People",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="me"
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ focused, size, color }) => (
            <Ionicons name="person-circle" size={size + 5} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
