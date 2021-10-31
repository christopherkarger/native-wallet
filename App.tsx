import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import * as Localization from "expo-localization";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet } from "react-native";
import { Config } from "./config";
import { Fonts } from "./constants";
import {
  ILocalMarket,
  insertItemToLocalDBTableMarket,
  resetLocalDBTableMarket,
  selectLocalDBTableMarket,
} from "./db/market";
import {
  ActiveLanguage,
  AppConfig,
  DefaultLanguage,
  MarketDataContext,
  SupportedLanguages,
  USDPriceContext,
} from "./models/context";
import { MarketData } from "./models/market-data";
import Main from "./pages/main";
import { fetchMarketData } from "./services/fetch-marketdata";
import { firebaseDB } from "./services/firebase-init";
import { registerNumeralFormat } from "./services/format-number";

LogBox.ignoreLogs(["Setting a timer"]);

let activeLanguage = DefaultLanguage;

const preload = () => {
  return Promise.all([
    Localization.getLocalizationAsync()
      .then((res) => {
        if (res.locale.includes(SupportedLanguages.DE)) {
          activeLanguage = SupportedLanguages.DE;
        }
      })
      .catch(() => {
        console.error("device language could not be set");
      }),
    Font.loadAsync({
      "karla-light": require("./assets/fonts/Karla-Light.ttf"),
      "karla-regular": require("./assets/fonts/Karla-Regular.ttf"),
      "karla-semibold": require("./assets/fonts/Karla-SemiBold.ttf"),
      "karla-bold": require("./assets/fonts/Karla-Bold.ttf"),
    }),
  ]).then(() => {});
};

export default function App() {
  let dbConnection: firebaseDB | undefined;
  const statusBarStyle = "light";
  const [appIsReady, setAppIsReady] = useState(false);
  const [marketData, setMarketData] = useState<MarketData>(new MarketData([]));
  const [USDPrice, setUSDPrice] = useState(0);

  const saveMarketToLocalDb = async (data: MarketData) => {
    try {
      await resetLocalDBTableMarket();
    } catch (err) {
      console.error(err);
      return;
    }

    for (const m of data.items) {
      try {
        await insertItemToLocalDBTableMarket(
          m.name,
          m.data.price,
          m.data.currency,
          m.data.rank,
          m.data.lastFetched,
          JSON.stringify(m.data.history),
          JSON.stringify(m.data.lastDayHistory)
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const localMarketDataToClass = (localMarketData: ILocalMarket[]) => {
    return new MarketData(
      localMarketData.map((item) => {
        return {
          name: item.name,
          data: {
            lastFetched: item.lastFetched,
            price: item.price,
            rank: item.rank,
            currency: item.currency,
            history: item.history ? JSON.parse(item.history) : [],
            lastDayHistory: item.lastDayHistory
              ? JSON.parse(item.lastDayHistory)
              : [],
          },
        };
      })
    );
  };

  useEffect(() => {
    try {
      selectLocalDBTableMarket().then((res) => {
        if (res && res.rows.length) {
          const localMarketData = res.rows._array;
          const m = localMarketDataToClass(localMarketData);
          if (marketData.items.length === 0) {
            setMarketData(m);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }

    fetchMarketData((data, db) => {
      if (dbConnection === undefined) {
        dbConnection = db;
      }
      if (data) {
        setMarketData(data);
        saveMarketToLocalDb(data);
        const tether = data.findItemByName("Tether");
        if (tether) {
          setUSDPrice(tether.data.price);
        }
      }
    });

    return () => {
      dbConnection?.off();
    };
  }, []);

  if (!appIsReady) {
    return (
      <AppLoading
        startAsync={preload}
        onFinish={() => {
          registerNumeralFormat(activeLanguage);
          setAppIsReady(true);
        }}
        onError={console.warn}
      />
    );
  }

  return (
    <USDPriceContext.Provider value={USDPrice}>
      <ActiveLanguage.Provider value={activeLanguage}>
        <AppConfig.Provider value={Config}>
          <MarketDataContext.Provider value={marketData}>
            <StatusBar style={statusBarStyle} />
            <Main />
          </MarketDataContext.Provider>
        </AppConfig.Provider>
      </ActiveLanguage.Provider>
    </USDPriceContext.Provider>
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
