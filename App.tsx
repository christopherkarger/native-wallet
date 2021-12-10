import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import * as Localization from "expo-localization";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { LogBox, StyleSheet } from "react-native";
import { EURO_STABLECOIN, Fonts } from "./constants";
import {
  getLocalStorageMarketData,
  getSettings,
  saveMarketDataToStorage,
  saveSettingsActiveCurrency,
  saveSettingsActiveLanguage,
} from "./db";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  DefaultCurrency,
  DefaultLanguage,
  EURPriceContext,
  MarketDataContext,
  SupportedCurrencies,
  SupportedLanguages,
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
  const [activeCurrency, setActiveCurrency] = useState(DefaultCurrency);

  const preload = () => {
    return Promise.all([
      getSettings(),
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

        if (localSettings.activeCurrency === SupportedCurrencies.EUR) {
          setActiveCurrency(SupportedCurrencies.EUR);
        }
      } else {
        const isGerman =
          localDeviceLanguage &&
          localDeviceLanguage.includes(SupportedLanguages.DE);

        if (isGerman) {
          // If there are no saved settings and the device language is german and currebcy to EUR
          setActiveLanguage(SupportedLanguages.DE);
          setActiveCurrency(SupportedCurrencies.EUR);
        }

        saveSettingsActiveLanguage(
          isGerman ? SupportedLanguages.DE : SupportedLanguages.EN
        );
        saveSettingsActiveCurrency(
          isGerman ? SupportedCurrencies.EUR : SupportedCurrencies.USD
        );
      }
    });
  };

  useEffect(() => {
    let dbConnection: firebaseDB | undefined;
    (async () => {
      try {
        const localMarket = await getLocalStorageMarketData();
        if (localMarket) {
          const tether = localMarket.findItemByName(EURO_STABLECOIN);
          if (tether) {
            setUSDPrice(tether.data.price);
          }
          if (marketData.items.length === 0) {
            setMarketData(localMarket);
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
          const tether = data.findItemByName(EURO_STABLECOIN);
          if (tether) {
            setUSDPrice(tether.data.price);
          }
          setMarketData(data);
          saveMarketDataToStorage(data);
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
    <ActiveCurrencyContext.Provider value={[activeCurrency, setActiveCurrency]}>
      <EURPriceContext.Provider value={USDPrice}>
        <ActiveLanguageContext.Provider
          value={[activeLanguage, setActiveLanguage]}
        >
          <MarketDataContext.Provider value={marketData}>
            <StatusBar style={statusBarStyle} />
            <Main />
          </MarketDataContext.Provider>
        </ActiveLanguageContext.Provider>
      </EURPriceContext.Provider>
    </ActiveCurrencyContext.Provider>
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
