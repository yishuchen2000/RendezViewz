import { StyleSheet, Text, View, Button } from "react-native";

import { router, Link, useLocalSearchParams, Stack } from "expo-router";

export default function Page() {
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: params.user,
        }}
      />
      <View style={styles.main}>
        <Text style={styles.subtitle}>
          Sample text message for {params.user}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor: "lightblue",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
