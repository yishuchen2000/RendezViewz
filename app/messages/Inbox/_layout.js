import React from "react";
import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Events from "./first_screen";
import Pending from "./pending";
import EventDetail from "../event_detail";

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const EventStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Events"
        component={Events}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const PendingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pending"
        component={Pending}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetail}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default function MyEventTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#0E0111" },
        tabBarLabelStyle: { fontSize: 13, color: "white" },
        tabBarPressColor: { color: "#0E0111" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      {/* <Tab.Screen name="My Events" component={Events} />
      <Tab.Screen name="Pending Invites" component={Pending} /> */}
      <Tab.Screen name="My Events" component={EventStack} />
      <Tab.Screen name="Pending Invites" component={PendingStack} />
      {/* <Tab.Screen name="EventDetail" component={EventDetail} /> */}
    </Tab.Navigator>
  );
}
