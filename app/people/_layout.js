// People.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabs from "./myTabs";
import People from "./people";
import AddFriendPage from "./AddFriendPage";
import FriendProfile from "./FriendProfile";
import NewFriendProfile from "./NewFriendProfile";
import MessageScreen from "./MessageScreen";
import ChatScreen from "./ChatScreen";
import AddEvent from "../messages/add_event";
import Success from "../messages/success";
import FriendRankingDetails from "./friendRankingDetails";
import FriendWishlistDetails from "./FriendWishlistDetails";
import { useRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const ChatScreenStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEvent}
        options={{
          title: "Schedule a new Watch Party!",
          headerStyle: { backgroundColor: "#000814" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          headerBackTitleVisible: "false",
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{ headerShown: false, headerBackTitleVisible: "false" }}
      />
    </Stack.Navigator>
  );
};

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
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      >
        {(props) => {
          console.log(props.route.params);
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
      <Stack.Screen
        name="FriendProfileRankingDetails"
        component={FriendRankingDetails}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="FriendWishlistDetails"
        component={FriendWishlistDetails}
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
        name="AddFriendPage"
        component={AddFriendPage}
        options={{
          title: "Add a Friend!",
          headerStyle: {
            backgroundColor: "#361866",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEvent}
        options={{
          title: "Schedule a new Watch Party!",
          headerStyle: { backgroundColor: "#000814" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        options={{ headerShown: false, headerBackTitleVisible: "false" }}
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
