import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

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
        headerTitle: "RendezViewz",
        headerStyle: {
          backgroundColor: "#311866",
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
        name="feed"
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="calendar-o" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="add" size={size + 5} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarLabel: "Friends",
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
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
