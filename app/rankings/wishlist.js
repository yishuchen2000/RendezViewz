import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";

import supabase from "../../Supabase";
import Ranking from "../../components/Movie";

import { Link } from "expo-router";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Rankings() {
  const [modalVisible, setModalVisible] = useState(false);

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("wishlist").select("*");
      setData(response.data);
    };
    fetchData();
  }, []);

  return (
    <LinearGradient colors={["#361866", "#E29292"]} style={styles.container}>
      {modalVisible && (
        <BlurView
          intensity={100}
          tint={"dark"}
          style={StyleSheet.absoluteFill}
        ></BlurView>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <View style={styles.buttonCloseContainer}>
                <Pressable
                  style={styles.buttonClose}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <MaterialIcons name="cancel" size={35} color={"black"} />
                </Pressable>
              </View>

              <Text style={styles.modalTitle}>Add Show</Text>
            </View>
            <Pressable style={styles.addButton}>
              <Text style={{ color: "white", fontSize: 15 }}>Add Show</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Ranking index={item.index} title={item.title} coverPic={item.url} />
        )}
        style={styles.rankList}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.plusButton}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <AntDesign name="pluscircle" size={60} color="#602683" />
        </Pressable>
      </View>
      <View style={styles.clapboard}>
        <Image
          source={require("../../assets/Clapboard2.png")}
          style={{
            flex: 1,
            width: windowWidth,
            resizeMode: "stretch",
          }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  buttonContainer: {
    position: "absolute",
    height: 60,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: windowHeight * 0.05,
    right: windowWidth * 0.05,
    backgroundColor: "transparent",
  },
  plusButton: {
    borderRadius: 50,
    backgroundColor: "white", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.65,
    margin: 20,
    backgroundColor: "pink",
    borderRadius: 20,
    padding: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    justifyContent: "space-between",
  },
  modalTitle: {
    flex: 1,
    fontSize: 32, // Adjust the font size as needed
    fontWeight: "bold",
    marginTop: 20,
    color: "black",
    textAlign: "center",
  },
  buttonCloseContainer: {
    position: "absolute",
    paddingTop: 5,
    paddingLeft: 5,
  },
  addButton: {
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "#602683",
    width: 200,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    bottom: 30,
  },
  plusButton: {
    borderRadius: 100,
    backgroundColor: "white", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: windowWidth * 0.02,
    flex: 1,
  },
});
