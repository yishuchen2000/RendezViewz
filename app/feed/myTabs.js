import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";
import Rankings from "./friendRankings";
import Wishlist from "./friendWishlist";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs({ id, route }) {
  console.log(route.params?.id);
  console.log(id);
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        tabBarStyle: { backgroundColor: "black" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Friend Rankings">
        {(props) => <Rankings userId={id} />}
      </Tab.Screen>
      <Tab.Screen name="Friend Wishlist">
        {(props) => <Wishlist userId={id} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
