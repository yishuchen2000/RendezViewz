import { Tabs } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import React, { useEffect } from "react";

import {
  useFonts,
  ImperialScript_400Regular,
} from "@expo-google-fonts/imperial-script";
// import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";

export default function HomeLayout() {
  const [fontsLoaded] = useFonts({
    ImperialScript: ImperialScript_400Regular,
  });

  useEffect(() => {
    const loadFontsAndNavigate = async () => {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding
        await fontsLoaded; // Wait until fonts are loaded

        // Now that fonts are loaded, hide the splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    loadFontsAndNavigate();
  }, [fontsLoaded]);

  // Ensure the splash screen remains visible until fonts are loaded
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
      </View>
    );
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
      <Tabs.Screen name="index" options={{ href: null }} redirect />
      <Tabs.Screen
        name="feed"
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
