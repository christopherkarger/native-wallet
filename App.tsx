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
  saveMarketToLocalDBTableMarket,
  selectLocalDBTableMarket,
  selectLocalDBTableSettings,
} from "./db";
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

export default function App() {
  const statusBarStyle = "light";
  const [appIsReady, setAppIsReady] = useState(false);
  const [marketData, setMarketData] = useState<MarketData>(new MarketData([]));
  const [USDPrice, setUSDPrice] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(DefaultLanguage);

  const preload = () => {
    return Promise.all([
      selectLocalDBTableSettings()
        .then((res) => {
          // If settings are already in database
          if (res && res.rows.length) {
            return res.rows._array[0];
          }
        })
        .catch(() => {
          console.error("could not select local settings");
          return undefined;
        }),
      Localization.getLocalizationAsync()
        .then((res) => res.locale)
        .catch(() => {
          console.error("device language could not be set");
          return undefined;
        }),
      Font.loadAsync({
        "karla-light": require("./assets/fonts/Karla-Light.ttf"),
        "karla-regular": require("./assets/fonts/Karla-Regular.ttf"),
        "karla-semibold": require("./assets/fonts/Karla-SemiBold.ttf"),
        "karla-bold": require("./assets/fonts/Karla-Bold.ttf"),
      }),
    ]).then(([localSettings, localDeviceLanguage]) => {
      if (localSettings) {
        // If saved language is german
        if (localSettings.activeLanguage === SupportedLanguages.DE) {
          setActiveLanguage(SupportedLanguages.DE);
        }
      } else {
        if (
          localDeviceLanguage &&
          localDeviceLanguage.includes(SupportedLanguages.DE)
        ) {
          // If there are no saved settings and the device language is german
          setActiveLanguage(SupportedLanguages.DE);
        }
      }
    });
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
    let dbConnection: firebaseDB | undefined;
    (async () => {
      try {
        const localMarket = await selectLocalDBTableMarket();
        if (localMarket && localMarket.rows.length) {
          const localMarketData = localMarket.rows._array;
          const m = localMarketDataToClass(localMarketData);
          if (marketData.items.length === 0) {
            setMarketData(m);
          }
        }
      } catch (err) {
        console.error(err);
      }

      fetchMarketData((data, db) => {
        if (dbConnection === undefined) {
          dbConnection = db;
        }
        if (data) {
          setMarketData(data);
          saveMarketToLocalDBTableMarket(data);
          const tether = data.findItemByName("Tether");
          if (tether) {
            setUSDPrice(tether.data.price);
          }
        }
      });
    })();

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
    <USDPriceContext.Provider value={[USDPrice, setUSDPrice]}>
      <ActiveLanguage.Provider value={[activeLanguage, setActiveLanguage]}>
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
