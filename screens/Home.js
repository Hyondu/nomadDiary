import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import colors from "../colors";
import { Ionicons } from "@expo/vector-icons";
import { useDB } from "../context";
import { FlatList, LayoutAnimation, Pressable } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const View = styled.View`
  flex: 1;
  background-color: ${colors.bgColor};
  padding: 100px 30px 0px 30px;
  align-items: center;
`;
const Title = styled.Text`
  font-size: 40px;
  color: ${colors.textColor};
  width: 100%;
  margin-bottom: 20px;
`;
const Btn = styled.Pressable`
  position: absolute;
  background-color: ${colors.btnColor};
  bottom: 50px;
  right: 30px;
  padding: 10px;
  width: 60px;
  height: 60px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  box-shadow: 1px 1px 5px rgba(41, 30, 95, 0.2);
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  padding: 10px 20px;
  border-radius: 10px;
  align-items: center;
`;

const Emotion = styled.Text`
  font-size: 20px;
  margin-right: 5px;
`;

const Message = styled.Text`
  font-size: 18px;
`;

const Separator = styled.View`
  height: 10px;
`;

const Home = ({ navigation }) => {
  const realm = useDB();
  const [feelings, setFeelings] = useState([]);

  useEffect(() => {
    const feelings = realm.objects("Feeling");
    feelings.addListener((feelings) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setFeelings(feelings.sorted("_id", true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onPressRecord = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      realm.delete(feeling);
    });
  };

  return (
    <View>
      <Title>Home</Title>
      <BannerAd
        unitId="ca-app-pub-3940256099942544/2934735716"
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
      <FlatList
        style={{
          marginVertical: 30,
          width: "100%",
        }}
        data={feelings}
        keyExtractor={(feeling) => feeling._id + ""}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressRecord(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </Pressable>
        )}
      />
      <Btn onPress={() => navigation.navigate("Write")}>
        <Ionicons name="add" size={30} color="white" />
      </Btn>
    </View>
  );
};

export default Home;
