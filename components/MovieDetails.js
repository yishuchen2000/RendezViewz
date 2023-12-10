import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const MovieDetails = ({ item }) => {
  const renderWriters = () => {
    if (item.Writer === "N/A") {
      return null;
    }

    const writers = item.Writer.split(",").map((writer, index) => (
      <Text key={index} style={styles.name} numberOfLines={1}>
        {writer.trim()}
      </Text>
    ));

    return (
      <View style={styles.writerContainer}>
        <Text style={styles.castPosition}>
          {item.Writer.includes(",") ? "Writers:" : "Writer:"}
        </Text>
        <View style={styles.writerList}>{writers}</View>
      </View>
    );
  };

  const renderGenreList = () => {
    if (!item.Genre || item.Genre === "N/A") {
      return null;
    }

    const genres = item.Genre.split(",").map((genre, index) => (
      <View key={index} style={styles.genreItem}>
        {index > 0 && <Text style={styles.genreText}> • </Text>}
        <Text style={styles.genreText}>{genre.trim()}</Text>
      </View>
    ));

    return <View style={styles.genreBox}>{genres}</View>;
  };

  const renderCast = () => {
    return renderListWithEllipsis(item.Actors, "Cast:");
  };

  const renderListWithEllipsis = (list, label) => {
    if (list === "N/A") {
      return null;
    }

    const items = list.split(",").map((item, index) => (
      <Text key={index} style={styles.name} numberOfLines={1}>
        {item.trim()}
      </Text>
    ));
    return (
      <View>
        <Text style={styles.castPosition}>{label}</Text>
        <View style={styles.columnList}>{items}</View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{item.Title}</Text>
        <Text style={styles.subheading}>
          {item.Year} • {item.Rated}
          {item.Runtime !== "N/A" &&
            item.Runtime !== "1 min" &&
            ` • ${item.Runtime}`}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.upperBody}>
          <View style={styles.posterContainer}>
            <Image source={{ uri: item.Poster }} style={styles.poster} />
          </View>
          <View style={styles.peopleContainer}>
            {item.Director !== "N/A" && (
              <View style={styles.directorContainer}>
                <Text style={styles.castPosition}> Director: </Text>
                <Text style={styles.name} numberOfLines={1}>
                  {item.Director}
                </Text>
              </View>
            )}
            {renderWriters()}
            {renderCast()}
          </View>
        </View>
        <View style={styles.lowerBody}>
          {renderGenreList()}
          <View style={styles.plotBox}>
            <Text style={styles.plotText}>{item.Plot}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: windowHeight * 0.03,
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    borderColor: "white",
  },
  subheading: {
    fontSize: 18,
    color: "lightgrey",
    padding: 5,
  },
  body: {
    width: windowWidth * 0.9,
    flex: 1,
  },
  upperBody: {
    flexDirection: "row",
    width: "100%",
    marginVertical: windowHeight * 0.02,
    gap: 10,
  },
  poster: {
    height: windowHeight * 0.32,
    width: windowWidth * 0.4,
  },
  posterContainer: {
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  peopleContainer: {
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 10,
    flex: 1,
    gap: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  name: {
    marginLeft: 15,
    color: "white",
    fontSize: 15,
  },
  castPosition: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  lowerBody: {
    gap: windowHeight * 0.02,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    padding: 10,
    paddingBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  genreBox: {
    flexDirection: "row",
  },
  genreItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  genreText: {
    color: "white",
    marginHorizontal: 5,

    fontSize: 15,
    fontWeight: "bold",
  },
  plotText: {
    marginLeft: 5,
    flexWrap: "wrap",
    color: "white",
    fontSize: 15,
  },
});

export default MovieDetails;
