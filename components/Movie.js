import { Text, View, StyleSheet, Image, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Ranking = ({ index, title, coverPic }) => {
  return (
    <View style={styles.container}>
      <View style={styles.indexBox}>
        <Text style={styles.index}>{index}.</Text>
      </View>
      <View style={styles.entry}>
        <View style={styles.coverPicContainer}>
          <Image style={styles.coverPic} source={{ uri: coverPic }} />
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Ranking;

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.1,
    flexDirection: "row",
    backgroundColor: "rgba(217, 217, 217, 0.4)",
    borderColor: "#361866",
    borderRadius: 10,
    marginVertical: windowHeight * 0.002,
    paddingVertical: 4,
    width: "100%",
  },
  index: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  indexBox: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    width: windowWidth * 0.15,
  },
  coverPic: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  coverPicContainer: {
    width: windowWidth * 0.15,
    height: "100%",
  },
  entry: {
    flexDirection: "row",
    gap: 20,
    paddingLeft: 1,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    width: windowWidth * 0.6,
  },
});
