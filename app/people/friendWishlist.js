import React from 'react';
import {StyleSheet, View, Dimensions, FlatList, Image} from 'react-native';
import {useState, useEffect} from 'react';
import {LinearGradient} from 'expo-linear-gradient';


import supabase from "../../Supabase";
import Ranking from "../../components/friendRanking";
import { useRoute } from "@react-navigation/native";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const UNDERLINE = require('../../assets/underline.png');

export default function Rankings() {
  const [data, setData] = useState([]);
  const route = useRoute();
  const { id } = route.params;

  useEffect(() => {
    const fetchData = async () => {

      const response = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", id);

      let sortedData = response.data.sort((a, b) => a.index - b.index);
      sortedData.forEach((item, index = 0) => {
        item.index = index + 1;
      });
      setData(sortedData);
    };
    fetchData();
  }, []);

  return (

    <LinearGradient colors={["#0e0111", "#311866"]} style={styles.container}>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <Ranking index={item.index} title={item.title} coverPic={item.url} />
        )}
        style={styles.rankList}
        contentContainerStyle={{paddingTop: 10, paddingBottom: 80}}
      />
      <View style={styles.buttonContainer}></View>
      <View style={styles.clapboard}>
        <Image
          source={require('../../assets/Clapboard2.png')}
          style={{
            flex: 1,
            width: windowWidth,
            resizeMode: 'stretch',
          }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  clapboard: {
    height: windowHeight * 0.03,
    width: windowWidth,
    alignSelf: 'center',
  },
  container: {
    paddingHorizontal: windowWidth * 0.02,
    flex: 1,
  },
});
