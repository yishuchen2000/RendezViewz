import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Rankings from "./friendRankings";
import Wishlist from "./friendWishlist";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

/*
const RankingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Rankings"
      component={Rankings}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Ranking Details"
      component={RankingDetails}
      options={{
        headerTransparent: true,
        headerTintColor: "white",
        headerTitle: "",
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

const WishlistStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wishlist Details"
        component={WishlistDetails}
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
*/

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        tabBarStyle: { backgroundColor: "#361866" },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold", color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Friend Rankings" component={Rankings} />
      <Tab.Screen name="Friend Wishlist" component={Wishlist} />
    </Tab.Navigator>
  );
}
