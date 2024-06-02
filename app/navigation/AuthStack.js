// AuthStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from "../../components/Auth/Auth";
import AuthSignUp from "../../components/Auth/AuthSignUp";
import Account from "../../components/Auth/Account";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Auth"
        component={Auth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthSignUp"
        component={AuthSignUp}
        options={{
          headerTransparent: true,
          headerTintColor: "white",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
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

export default AuthStack;
