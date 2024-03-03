// Auth.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Auth from "../../app/Auth/Auth";
import AuthSignUp from "../../app/Auth/AuthSignUp";

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
    </Stack.Navigator>
  );
};

const AuthPage = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthPage"
        component={AuthStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthPage;
