import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import supabase from "../Supabase";
import { Button, Input } from "react-native-elements";
import Account from "./Account";
import { LinearGradient } from "expo-linear-gradient";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstTime, setFirstTime] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    // setFirstTime(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    // if (!session)
    //   Alert.alert("Please check your inbox for email verification!");
    // setLoading(false);
  }

  // if (firstTime) {
  //   return (
  //     <Account key={session.user.id} session={session} />
  //   );
  // };

  return (
    // <LinearGradient colors={["#361866", "#E29292"]} style={[styles.background]}>
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
          buttonStyle={{ backgroundColor: "#361866" }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
          buttonStyle={{ backgroundColor: "#361866" }}
        />
      </View>
    </View>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // borderWidth: 1,
  },
  container: {
    // flex: 1,
    // borderWidth: 1,
    marginTop: 40,
    // padding: 12,
    // flex: 1,
    // width: "100%",
    padding: 12,
    // paddingBottom: 400,
    // justifyContent: "center",
    // alignItems: "center",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
