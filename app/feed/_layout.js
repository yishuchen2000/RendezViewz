import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Index from "../index";
import ShowDetails from "./show_details";
import FriendProfile from "./FriendProfile";

const Stack = createStackNavigator();

export default function Feed() {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen
        name="Index"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowDetails"
        component={ShowDetails}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
