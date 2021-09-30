import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet } from "react-native";
import GradientView from "./components/gradient-view";
import SafeArea from "./components/safe-area";
import AppText from "./components/text";
import { config } from "./config";
import { Fonts } from "./constants";
import useAppStatus from "./hooks/handle-app-state";
import { IConfig } from "./models/config";
import { AppConfig, defaultConfig, MarketData } from "./models/context";
import Main from "./pages/main";
import { fetchMarketData, IMarketData } from "./services/fetch-marketdata";
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
  const [appIsReady, setAppIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [fetchedConfig, setFetchedConfig] = useState(defaultConfig);
  const [marketData, setMarketData] = useState<IMarketData>({});
  const appStatus = useAppStatus();

  useEffect(() => {
    setLoading(true);

    fetch(`${config.configUrl}?v5`)
      .then((response) => response.json())
      .then((res: IConfig) => setFetchedConfig(res))
      .catch((err) => {
        console.log(err);
        setLoadingError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (appStatus === "active") {
      fetchMarketData((data, db) => {
        if (dbConnection === undefined) {
          dbConnection = db;
        }
        setMarketData(data);
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

  if (loading || loadingError) {
    return (
      <GradientView>
        <StatusBar style="light" />
        <SafeArea style={styles.configLoadingArea}>
          <AppText style={styles.configLoadingText}>
            {loading && <>Lade...</>}
            {loadingError && <>Da ist wohl was schief gegangen!...</>}
          </AppText>
        </SafeArea>
      </GradientView>
    );
  }

  return (
    <AppConfig.Provider value={fetchedConfig}>
      <MarketData.Provider value={marketData}>
        <StatusBar style="light" />
        <Main />
      </MarketData.Provider>
    </AppConfig.Provider>
  );
}

const styles = StyleSheet.create({
  configLoadingArea: {
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
