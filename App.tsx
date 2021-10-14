import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet } from "react-native";
import { Config } from "./config";
import { Fonts } from "./constants";
import useAppStatus, { AppStaus } from "./hooks/handle-app-state";
import { AppConfig, MarketDataContext } from "./models/context";
import { MarketData } from "./models/market-data";
import Main from "./pages/main";
import { fetchMarketData } from "./services/fetch-marketdata";
import { firebaseDB } from "./services/firebase-init";

LogBox.ignoreLogs(["Setting a timer"]);

const preload = () => {
  return Font.loadAsync({
    "karla-light": require("./assets/fonts/Karla-Light.ttf"),
    "karla-regular": require("./assets/fonts/Karla-Regular.ttf"),
    "karla-semibold": require("./assets/fonts/Karla-SemiBold.ttf"),
    "karla-bold": require("./assets/fonts/Karla-Bold.ttf"),
  });
};

export default function App() {
  let dbConnection: firebaseDB | undefined;
  const statusBarStyle = "light";
  const [appIsReady, setAppIsReady] = useState(false);
  const [marketData, setMarketData] = useState<MarketData>(new MarketData([]));
  const appStatus = useAppStatus();

  useEffect(() => {
    if (appStatus === AppStaus.Active) {
      fetchMarketData((data, db) => {
        if (dbConnection === undefined) {
          dbConnection = db;
        }
        if (data) {
          setMarketData(data);
        }
      });
    } else {
      dbConnection?.off();
      dbConnection = undefined;
    }
  }, [appStatus]);

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={preload}
        onFinish={() => setAppIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <AppConfig.Provider value={Config}>
      <MarketDataContext.Provider value={marketData}>
        <StatusBar style={statusBarStyle} />
        <Main />
      </MarketDataContext.Provider>
    </AppConfig.Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  configLoadingText: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  },
});
