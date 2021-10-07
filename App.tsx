import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet } from "react-native";
import ApiNotSupported from "./components/api-not-supported";
import GradientView from "./components/gradient-view";
import SafeArea from "./components/safe-area";
import AppText from "./components/text";
import { config } from "./config";
import { apiVersion, Fonts } from "./constants";
import useAppStatus, { AppStaus } from "./hooks/handle-app-state";
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
  const statusBarStyle = "light";
  const [appIsReady, setAppIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [apiSupported, setApiSupported] = useState(false);
  const [fetchedConfig, setFetchedConfig] = useState(defaultConfig);
  const [marketData, setMarketData] = useState<IMarketData>({});
  const appStatus = useAppStatus();

  useEffect(() => {
    setLoading(true);

    const configFectchHeader = new Headers();
    configFectchHeader.append("pragma", "no-cache");
    configFectchHeader.append("cache-control", "no-cache");
    const fetchInit = {
      method: "GET",
      headers: configFectchHeader,
    };

    fetch(`${config.configUrl}`, fetchInit)
      .then((response) => response.json())
      .then((res: IConfig) => {
        if (res.apiVersion === apiVersion) {
          setApiSupported(true);
          setFetchedConfig(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoadingError(true);
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading || loadingError) {
    return (
      <GradientView>
        <StatusBar style={statusBarStyle} />
        <SafeArea style={styles.loadingContainer}>
          <AppText style={styles.configLoadingText}>
            {loading && <>Lade...</>}
            {loadingError && <>Da ist wohl was schief gegangen!...</>}
          </AppText>
        </SafeArea>
      </GradientView>
    );
  }

  if (!apiSupported) {
    return <ApiNotSupported statusBarStyle={statusBarStyle}></ApiNotSupported>;
  }

  return (
    <AppConfig.Provider value={fetchedConfig}>
      <MarketData.Provider value={marketData}>
        <StatusBar style={statusBarStyle} />
        <Main />
      </MarketData.Provider>
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
