import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import React, { useState } from "react";
import { LogBox } from "react-native";
import { config } from "./config";
import Main from "./pages/main";

LogBox.ignoreLogs(["Setting a timer"]);

const fetchFonts = async () => {
  return Promise.all([
    fetch(config.configUrl)
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
      }),
    Font.loadAsync({
      "roboto-black": require("./assets/fonts/Roboto-Black.ttf"),
      "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
    }),
  ])
    .then(() => {})
    .catch((err) => {
      throw new Error(err);
    });
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setAppIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return <Main />;
}
