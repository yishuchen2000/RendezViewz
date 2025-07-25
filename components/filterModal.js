import React, { useState } from "react";
import { View, Modal, Text, Pressable, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

function FilterModal({
  modalVisible,
  setModalVisible,
  genreList,
  exportGenres,
}) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenreSelection = (genre) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genre)) {
        return prevSelectedGenres.filter(
          (selectedGenre) => selectedGenre !== genre
        );
      } else {
        return [...prevSelectedGenres, genre];
      }
    });
  };

  const applyFilters = () => {
    exportGenres(selectedGenres);
    setSelectedGenres([]);
    setModalVisible(false);
  };

  // Function to render genres in two columns
  const renderGenresInColumns = () => {
    const midIndex = Math.ceil(genreList.length / 2);
    return (
      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          {genreList.slice(0, midIndex).map(renderGenre)}
        </View>
        <View style={styles.column}>
          {genreList.slice(midIndex).map(renderGenre)}
        </View>
      </View>
    );
  };

  // Function to render a single genre
  const renderGenre = (genre, index) => (
    <Pressable
      key={index}
      style={[
        styles.genreButton,
        {
          backgroundColor: selectedGenres.includes(genre)
            ? "#858AE3"
            : "lightgrey",
        },
      ]}
      onPress={() => toggleGenreSelection(genre)}
    >
      <Text
        style={{ color: selectedGenres.includes(genre) ? "black" : "black" }}
      >
        {genre}
      </Text>
    </Pressable>
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.buttonCloseContainer}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="cancel" size={30} color={"white"} />
            </Pressable>
            <Text style={styles.modalTitle}>Filter by Genre</Text>
            {renderGenresInColumns()}
            <Pressable style={styles.applyButton} onPress={applyFilters}>
              <Text style={{ color: "black", fontWeight: "bold" }}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#0E0111",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    position: "relative",
  },
  buttonCloseContainer: {
    position: "absolute",
    color: "white",
    padding: 15,
    width: 60,
    height: 60,
    zIndex: 1,
  },
  modalTitle: {
    marginBottom: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  columnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  genreButton: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  applyButton: {
    alignSelf: "center",
    width: 190,
    height: 50,
    borderRadius: 50,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#858AE3",
    borderWidth: 1,
    color: "white",
  },
});

export default FilterModal;
