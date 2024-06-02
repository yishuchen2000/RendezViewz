import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, ActivityIndicator, Button } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import {
  useFonts,
  ImperialScript_400Regular,
} from "@expo-google-fonts/imperial-script";
import * as SplashScreen from "expo-splash-screen";
import supabase from "../Supabase";
import AuthStack from "./navigation/AuthStack";
import RankingTabs from "./rankings/_layout";
import PeopleStack from "./people/_layout";
import MessagesLayout from "./messages/_layout";
import FeedLayout from "./feed/_layout";
import ProfilePage from "./me/_layout";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerTitle: "RendezViewz",
        headerStyle: {
          backgroundColor: "#311866",
        },
        headerTitleStyle: {
          color: "white",
          fontFamily: "ImperialScript",
          fontSize: 30,
        },
        tabBarStyle: { backgroundColor: "#311866" },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#BBADD3",
      }}
    >
      <Tab.Screen
        name="feed"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
        component={FeedLayout}
      />
      <Tab.Screen
        name="messages"
        component={MessagesLayout}
        options={{
          tabBarLabel: "Calendar",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="calendar-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="rankings"
        component={RankingTabs}
        options={{
          tabBarLabel: "Rankings",
          tabBarIcon: ({ size, color }) => (
            <Entypo name="add-to-list" size={size + 5} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="people"
        component={PeopleStack}
        options={{
          tabBarLabel: "People",
          tabBarIcon: ({ size, color }) => (
            <FontAwesome name="group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="me"
        options={{
          tabBarLabel: "Me",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person-circle" size={size + 5} color={color} />
          ),
        }}
        component={ProfilePage}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingProfile(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingProfile(false);
    });
  }, []);

  const [fontsLoaded] = useFonts({
    ImperialScript: ImperialScript_400Regular,
  });

  useEffect(() => {
    const loadFontsAndNavigate = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await fontsLoaded;
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    loadFontsAndNavigate();
  }, [fontsLoaded]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear the session state
  };

  if (!fontsLoaded || loadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading...</Text>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    );
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          <>
            <Stack.Screen name="MainApp" component={MyTabs} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
