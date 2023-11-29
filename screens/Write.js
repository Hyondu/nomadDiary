import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import colors from "../colors";
import { useDB } from "../context";
import {
  AdEventType,
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

const View = styled.View`
  background-color: ${colors.bgColor};
  flex: 1;
  padding: 0 30px;
`;

const Title = styled.Text`
  color: ${colors.textColor};
  margin: 50px 0px;
  text-align: center;
  font-size: 28px;
  font-weight: 500;
`;

const emotions = ["😀", "🥲", "🤬", "😌", "😍", "🤩", "😎", "😕", "😤", "😡", "🤯", "🫤"];

const EmotionsContainer = styled.View`
  height: 70px;
`;

const Emotions = styled.ScrollView`
  flex-direction: row;
  margin-bottom: 20px;
`;

const Emotion = styled.Pressable`
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  margin: 0px 4px;
  width: 50px;
  height: 50px;
  border-width: ${({ selected }) => (selected ? "2px" : "0px")};
  border-color: rgba(0, 0, 0, 0.3);
`;

const EmotionText = styled.Text`
  font-size: 24px;
`;

const TextInput = styled.TextInput`
  background-color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 18px;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;

const Btn = styled.Pressable`
  background-color: ${colors.btnColor};
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 20px;
  align-items: center;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
`;

const BtnText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: white;
`;

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
  TestIds.REWARDED_INTERSTITIAL,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

const Write = ({ navigation }) => {
  const realm = useDB();
  const [selectedEmotion, setEmotion] = useState(null);
  const [feelings, setFeelings] = useState("");

  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setAdLoaded(true);
      }
    );
    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();
    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
    };
  }, []);

  const onEmotionPress = (emotion) => setEmotion(emotion);
  const onChange = (text) => setFeelings(text);
  const onSubmit = async () => {
    if (feelings === "" || selectedEmotion == null) {
      return alert("Please write your feelings");
    }
    if (adLoaded) {
      await rewardedInterstitial.show();
      await rewardedInterstitial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () =>
        rewardedInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
          realm.write(() => {
            realm.create("Feeling", {
              _id: Date.now(),
              emotion: selectedEmotion,
              message: feelings,
            });
          });
          navigation.goBack();
        })
      );
    }
  };

  return (
    <View>
      <Title>How do you feel now?</Title>
      <EmotionsContainer>
        <Emotions horizontal>
          {emotions.map((emotion, index) => (
            <Emotion
              selected={emotion === selectedEmotion}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
              ]}
              onPress={() => onEmotionPress(emotion)}
              key={index}
            >
              <EmotionText>{emotion}</EmotionText>
            </Emotion>
          ))}
        </Emotions>
      </EmotionsContainer>
      <TextInput
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
        value={feelings}
        placeholder={"Write your feelings."}
        placeholderTextColor="grey"
      />
      <Btn onPress={onSubmit}>
        <BtnText>Save</BtnText>
      </Btn>
    </View>
  );
};

export default Write;
