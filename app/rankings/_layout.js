import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Rankings from "./rankings";
import Wishlist from "./wishlist";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#361866" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="My Rankings" component={Rankings} />
      <Tab.Screen name="My Wishlist" component={Wishlist} />
    </Tab.Navigator>
  );
}
