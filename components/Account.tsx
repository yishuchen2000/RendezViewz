import { useState, useEffect } from "react";
import supabase from "../Supabase";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Dimensions,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";
import { Button, Input } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import { Session } from "@supabase/supabase-js";
import { FlashList } from "@shopify/flash-list";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [users, setUsers] = useState<{ id: string }[]>([]);

  useEffect(() => {
    if (session) getProfile();
    if (session) getAllUsers();
  }, [session]);

  async function getAllUsers() {
    const { data, error } = await supabase.from("profiles").select("id");
    if (error) console.log(error?.message);
    setUsers(data ?? []);
  }

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#311866", "#b67287"]}
      style={[styles.container, { paddingHorizontal: 40 }]}
    >
      <Text style={styles.title}>Edit Account</Text>
      <SafeAreaView style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Username"
            value={username || ""}
            labelStyle={styles.textWhite}
            onChangeText={(text) => setUsername(text)}
            inputStyle={styles.textWhite}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Email"
            value={session?.user?.email}
            disabled
            labelStyle={styles.textWhite}
            inputStyle={styles.textWhite}
          />
        </View>

        <View style={[styles.buttonSpaced, styles.mt20]}>
          <TouchableHighlight
            activeOpacity={0.6} // Adjust the opacity as needed
            underlayColor="transparent" // Set the underlay color to transparent
          >
            <Button
              title={loading ? "Loading ..." : "Update"}
              onPress={() =>
                updateProfile({ username, website, avatar_url: avatarUrl })
              }
              disabled={loading}
              titleStyle={{ color: "white" }}
              buttonStyle={{
                backgroundColor: "#311866",
                borderRadius: 20,
                height: 50,
                paddingHorizontal: 20,
              }}
            />
          </TouchableHighlight>
        </View>

        <View style={styles.buttonSpaced}>
          <TouchableHighlight
            activeOpacity={0.6} // Adjust the opacity as needed
            underlayColor="transparent" // Set the underlay color to transparent
          >
            <Button
              title="Sign Out"
              onPress={() => supabase.auth.signOut()}
              titleStyle={{ color: "white" }}
              disabled={loading}
              buttonStyle={{
                backgroundColor: "transparent",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 20,
                height: 50,
                paddingHorizontal: 20,
              }}
            />
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

{
  /* <View style={[styles.verticallySpaced, { height: 200 }]}>
        <FlashList
          data={users}
          renderItem={({ item }) => <Text>{item.id}</Text>}
          estimatedItemSize={200}
        />
      </View> */
}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    alignItems: "center",
    // backgroundColor: "#001D3D",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "left", // Align text to the left
    alignSelf: "flex-start",
  },
  textWhite: {
    color: "white", // Set text color to white
  },
  verticallySpaced: {
    paddingHorizontal: 40,
    paddingTop: 4,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  buttonSpaced: {
    paddingHorizontal: 40,
    paddingTop: 4,
    paddingBottom: 12,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 25,
  },
});
