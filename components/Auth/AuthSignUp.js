import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import supabase from "../../Supabase";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

// Import the default profile picture
const defaultProfilePic = require("../../assets/defaultProfilePic.webp");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AuthSignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [profileImage, setProfileImage] = useState(defaultProfilePic);
  const [loading, setLoading] = useState(false);

  const allFieldsFilled = email && password && firstName && lastInitial;

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
      const { status: galleryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (galleryStatus !== "granted") {
        alert("Sorry, we need media library permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, path, fileName) => {
    // Convert the local URI to a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Prepare form data
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: fileName,
      type: blob.type,
    });

    // Upload the image to Supabase storage
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(path, formData, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (error) {
      throw error;
    }
    return data.Key;
  };

  async function signUpWithEmail() {
    if (!allFieldsFilled) {
      Alert.alert(`Make sure every field is filled`);
      return;
    }
    setLoading(true);
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (user) {
      try {
        let profileImageUri = profileImage.uri
          ? profileImage.uri
          : profileImage;

        // Check if the profileImage is still the default picture
        if (profileImage === defaultProfilePic) {
          // Use the default picture URI
          profileImageUri = Image.resolveAssetSource(defaultProfilePic).uri;
        }

        // Log user ID and profile image URI
        console.log("User ID:", user.id);
        console.log("Profile Image URI:", profileImageUri);

        // Upload the profile image to Supabase storage
        const filePath = `public/${user.id}.jpg`;
        const uploadedImagePath = await uploadImage(
          profileImageUri,
          filePath,
          "profile.jpg"
        );

        // Get the correct URL for the uploaded image
        const {
          data: { publicUrl },
          error: urlError,
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        if (urlError) {
          console.log("URL Error:", urlError);
          Alert.alert(urlError.message);
        } else {
          // Log the final profile image URL
          console.log("Profile Image URL:", publicUrl);

          const updates = {
            id: user.id,
            username: `${firstName} ${lastInitial}.`,
            friend_ids: [],
            info: "Here's what I want to watch!",
            avatar_url: publicUrl, // Store the profile image URL
            isProfileComplete: true, // Profile is marked as complete
            updated_at: new Date(),
          };

          // Log the updates object
          console.log("Profile Updates:", updates);

          const { error: profileError } = await supabase
            .from("profiles")
            .upsert(updates);

          if (profileError) {
            Alert.alert(profileError.message);
          } else {
            // Navigate to the main app screen after successful sign-up and profile creation
            navigation.navigate("MainApp"); // This should match the screen name used in your Stack.Navigator
          }
        }
      } catch (error) {
        console.log("Upload Error:", error);
        Alert.alert(error.message);
      }
    }
    setLoading(false);
  }

  return (
    <LinearGradient
      colors={["#0e0111", "#311866"]}
      style={[styles.container, { paddingHorizontal: 40 }]}
    >
      <SafeAreaView style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{
              type: "font-awesome",
              name: "envelope",
              color: "white",
            }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={"none"}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: "font-awesome", name: "lock", color: "white" }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={"none"}
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="First Name"
            leftIcon={{
              type: "font-awesome",
              name: "user",
              color: "white",
            }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
            placeholder="First Name"
            autoCapitalize={"words"}
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Last Initial"
            leftIcon={{
              type: "font-awesome",
              name: "user",
              color: "white",
            }}
            labelStyle={{ color: "white" }}
            inputStyle={{ color: "white" }}
            onChangeText={(text) => setLastInitial(text)}
            value={lastInitial}
            placeholder="Last Initial"
            autoCapitalize={"characters"}
          />
        </View>
        <View style={[styles.imageContainer, styles.mt20]}>
          <Text style={styles.label}>Profile Picture</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Pick Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imagePreview}>
            <Image
              source={
                typeof profileImage === "string"
                  ? { uri: profileImage }
                  : profileImage
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.buttonSpaced}>
          <Button
            title="Sign Up"
            titleStyle={{ color: allFieldsFilled ? "white" : "grey" }}
            disabled={loading}
            onPress={signUpWithEmail}
            buttonStyle={{
              backgroundColor: "transparent",
              borderColor: allFieldsFilled ? "white" : "grey",
              borderWidth: 2,
              borderRadius: 20,
              height: 50,
              paddingHorizontal: 20,
            }}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  verticallySpaced: {
    paddingHorizontal: 40,
    paddingTop: 4,
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageButton: {
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  imageButtonText: {
    color: "white",
    fontSize: 16,
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 100, // Make the preview round
    marginTop: 20,
    marginBottom: 10, // Add space below the preview image
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensure the image is cropped to the circle
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100, // Make the image round
  },
  imagePlaceholderText: {
    color: "white",
    fontSize: 16,
  },
  label: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonSpaced: {
    paddingHorizontal: 40,
    paddingTop: 4,
    paddingBottom: 12,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 10,
  },
});
