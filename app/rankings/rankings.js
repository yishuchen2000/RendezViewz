import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  Keyboard,
  LayoutAnimation,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

import supabase from "../../Supabase";
import Ranking from "../../components/Movie";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const UNDERLINE = require("../../assets/underline.png");

export default function Rankings() {
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState(null);
  const [possibleEntries, setPossibleEntries] = useState(null);
  const [entry, setEntry] = useState(null);
  const [entryPic, setEntryPic] = useState(null);
  const [rankValue, setRankValue] = useState(null);
  const [rankCount, setRankCount] = useState(null);
  const [modalValid, setModalValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("rankings").select("*");
      const sortedData = response.data.sort((a, b) => a.index - b.index);
      setData(sortedData);
      setRankCount(response.data.length);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await supabase.from("rankable").select("*");
      setPossibleEntries(response.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (entry && rankValue) {
      setModalValid(true);
    } else {
      setModalValid(false);
    }
  }, [entry, rankValue]);

  const handleRank = async () => {
    setModalVisible(!modalVisible); //close modal
    let newId = Date.now();
    let adjustedRank = parseInt(rankValue);

    let response = await supabase.from("rankings").select("*");
    let sortedData = response.data.sort((a, b) => a.index - b.index);

    if (adjustedRank > rankCount + 1) {
      adjustedRank = rankCount + 1;
    } else {
      const updatedRankings = sortedData.map((item) => {
        if (item.index >= adjustedRank) {
          item.index += 1;
        }
        return item;
      });
      await supabase.from("rankings").upsert(updatedRankings);
    }
    const { data } = await supabase.from("rankings").upsert([
      {
        id: newId,
        title: entry,
        index: adjustedRank,
        url: entryPic,
      },
    ]);
    response = await supabase.from("rankings").select("*");
    sortedData = response.data.sort((a, b) => a.index - b.index);

    setData(sortedData);
    setRankCount(response.data.length);
  };
  //Animation for delete
  const layoutAnimConfig = {
    duration: 300,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  const handleDelete = async (id, index) => {
    await supabase.from("rankings").delete().eq("id", id);

    let response = await supabase.from("rankings").select("*");
    sortedData = response.data.sort((a, b) => a.index - b.index);

    const updatedRankings = sortedData.map((item) => {
      if (item.index > index) {
        item.index -= 1;
      }
      return item;
    });
    await supabase.from("rankings").upsert(updatedRankings);

    setData(updatedRankings);
    LayoutAnimation.configureNext(layoutAnimConfig);
    setRankCount(updatedRankings.length);
  };

  return (
    <LinearGradient
      colors={["#361866", "#E29292"]}
      style={styles.container}
      onTouchStart={() => {
        Keyboard.dismiss();
      }}
    >
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
              <Text style={styles.modalTitle}>New Ranking</Text>
              <Image style={styles.underline} source={UNDERLINE} />
              <Pressable
                style={styles.buttonCloseContainer}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <View style={styles.buttonClose}>
                  <MaterialIcons name="cancel" size={30} color={"black"} />
                </View>
              </Pressable>
            </View>
            <View style={styles.questionsContainer}>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Select Title:</Text>
                <Dropdown
                  style={styles.titleDropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={possibleEntries}
                  search
                  value={entry}
                  maxHeight={260}
                  labelField="title"
                  valueField="title"
                  placeholder="Choose Content"
                  searchPlaceholder="Search..."
                  onChange={(item) => {
                    setEntry(item.title);
                    setEntryPic(item.url);
                  }}
                />
              </View>
              <View style={styles.titleSelectContainer}>
                <Text style={styles.titleQuestion}> Enter Rank:</Text>
                <TextInput
                  style={styles.rankingInput}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={(text) => setRankValue(text)}
                />
              </View>
            </View>
            <Pressable
              style={[
                styles.addButton,
                { backgroundColor: modalValid ? "#602683" : "gray" },
              ]}
              onPress={handleRank}
              disabled={!modalValid}
            >
              <Text
                style={{ color: "white", fontSize: 15, fontWeight: "bold" }}
              >
                Update Ranking
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Ranking
            index={item.index}
            title={item.title}
            coverPic={item.url}
            onDelete={() => handleDelete(item.id, item.index)}
          />
        )}
        style={styles.rankList}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 100 }}
      />
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.plusButton}
          onPress={() => {
            setModalVisible(!modalVisible);
            setEntry(null);
          }}
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
    borderRadius: 100,
    backgroundColor: "white", // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: windowWidth * 0.8,
    height: windowHeight * 0.55,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#361866",
  },
  modalHeader: {
    flexDirection: "row",
    width: windowWidth * 0.8,
    justifyContent: "space-between",
  },
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: "center",
  },
  modalTitle: {
    flex: 1,
    fontSize: 32, // Adjust the font size as needed
    fontWeight: "bold",
    marginTop: 20,
    color: "#361866",
    textAlign: "center",
  },
  underline: {
    transform: [{ scaleX: -1 }, { rotate: "4deg" }],
    alignSelf: "center",
    position: "absolute",
    top: 45,
    left: 48,
    width: "70%",
    height: 90,
    tintColor: "#361866",
  },
  buttonCloseContainer: {
    position: "absolute",
    color: "white",
    padding: 5,
    width: 80,
    height: 50,
  },
  questionsContainer: {
    width: "90%",
    height: "60%",
    marginTop: 80,
    gap: 40,
  },
  titleSelectContainer: {
    width: "100%",
    gap: 8,
  },
  titleQuestion: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#361866",
  },
  titleDropdown: {
    marginHorizontal: 20,
    paddingLeft: 15,
    backgroundColor: "lavender",
    color: "purple",
    height: 50,
    width: "90",
    borderRadius: 10,
    borderWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    color: "#602683",
    marginRight: 5,
    fontSize: 16,
    alignSelf: "center",
  },
  rankingInput: {
    marginHorizontal: 20,
    paddingLeft: 15,
    backgroundColor: "lavender",
    color: "purple",
    height: 50,
    width: "90",
    borderRadius: 10,
    borderWidth: 0.5,
  },
  addButton: {
    alignSelf: "center",
    position: "absolute",
    width: 200,
    height: 50,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    bottom: 30,
  },
  container: {
    paddingHorizontal: windowWidth * 0.02,
    flex: 1,
  },
});
