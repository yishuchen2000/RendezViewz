// People.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabs from "./myTabs";
import People from "./people";
import AddFriendPage from "./AddFriendPage";
import FriendProfile from "./FriendProfile";
import NewFriendProfile from "./NewFriendProfile";

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
      <Stack.Screen
        name="NewFriendProfile"
        component={NewFriendProfile}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddFriendPage" //addFriend
        component={AddFriendPage}
        options={{
          title: "Add a Friend!",
          headerStyle: {
            backgroundColor: "#361866", // Set the background color of the header
          },
          headerTitleStyle: {
            color: "white", // Set the font color of the title
          },
          headerTintColor: "white", // Set the color of the back arrow
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
