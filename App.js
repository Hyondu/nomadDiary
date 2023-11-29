import * as SplashScreen from "expo-splash-screen";
import Realm from "realm";
import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import Navigator from "./navigator";
import { DBContext } from "./context";

SplashScreen.preventAutoHideAsync();

// Define your object model
const FeelingSchema = {
  name: "Feeling",
  properties: {
    _id: "int",
    emotion: "string",
    message: "string",
  },
  primaryKey: "_id",
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    async function prepare() {
      try {
        const connection = await Realm.open({
          path: "nomadDiaryDB",
          schema: [FeelingSchema],
        });
        setRealm(connection);
      } catch (e) {
        console.warn(e);
      } finally {
        setReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }
  return (
    <DBContext.Provider value={realm}>
      <NavigationContainer onReady={onLayoutRootView}>
        <Navigator />
      </NavigationContainer>
    </DBContext.Provider>
  );
}
