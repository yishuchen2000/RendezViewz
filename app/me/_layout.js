import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Me from "./me";
import ShowDetails from "./show_details";

const Stack = createStackNavigator();

export default function Feed() {
  return (
    <Stack.Navigator initialRouteName="Index">
      <Stack.Screen name="me" component={Me} options={{ headerShown: false }} />
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
    </Stack.Navigator>
  );
}
