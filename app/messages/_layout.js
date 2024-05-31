import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FirstScreen from "./first_screen";
import EventDetail from "./event_detail";
import AddEvent from "./add_event";
import Success from "./success";
import MyEventTabs from "./Inbox/_layout";

const Stack = createNativeStackNavigator();

export default function MessagesLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FirstScreen"
        component={FirstScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Inbox"
        component={MyEventTabs}
        options={{
          title: "Invite Inbox",
          headerStyle: { backgroundColor: "#000814" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          headerBackTitleVisible: "false",
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{
          title: "Event Details",
          headerStyle: { backgroundColor: "#000814" },
          headerTitleStyle: { color: "white" },
          headerTintColor: "white",
          headerBackTitleVisible: "false",
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
}
