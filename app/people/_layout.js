// People.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabs from "./myTabs";
import People from "./people";

const Stack = createStackNavigator();

const PeopleStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="People"
        component={People}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Friend Movies"
        component={MyTabs}
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

const PeoplePage = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PeoplePage"
        component={PeopleStack}
        options={{ headerShown: false }}
      />
      {/* Add more screens within the People page if needed */}
    </Stack.Navigator>
  );
};

export default PeoplePage;
