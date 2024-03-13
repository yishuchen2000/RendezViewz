import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Index from "../index";
import ShowDetails from "./show_details";
import FriendProfile from "./FriendProfile";
import MyTabs from "./myTabs";

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
        name="Friend Movies"
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
        // initialParams={{userId }}
      >
        {(props) => {
          console.log(props.route.params); // Check what parameters are received
          return <MyTabs {...props} id={props.route.params?.id} />;
        }}
      </Stack.Screen>
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
