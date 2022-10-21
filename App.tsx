import * as Font from "expo-font";
import * as Localization from "expo-localization";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { LogBox, StyleSheet, View } from "react-native";
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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const preload = async () => {
    return Promise.all([
      getSettings(),
      Font.loadAsync({
        "karla-light": require("./assets/fonts/Karla-Light.ttf"),
        "karla-regular": require("./assets/fonts/Karla-Regular.ttf"),
        "karla-semibold": require("./assets/fonts/Karla-SemiBold.ttf"),
        "karla-bold": require("./assets/fonts/Karla-Bold.ttf"),
      }),
    ]).then(([localSettings]) => {
      let activeDeviceLanguage: SupportedLanguages = SupportedLanguages.EN;

      if (localSettings) {
        // If saved language is german
        if (localSettings.activeLanguage === SupportedLanguages.DE) {
          activeDeviceLanguage = SupportedLanguages.DE;
        }

        if (localSettings.activeCurrency === SupportedCurrencies.EUR) {
          setActiveCurrency(SupportedCurrencies.EUR);
        }
      } else {
        (async () => {
          const localDeviceLanguage = await Localization.getLocalizationAsync()
            .then((res) => res.locale)
            .catch(() => {
              console.error("device language could not be set");
              return undefined;
            });
          const isGerman =
            localDeviceLanguage &&
            localDeviceLanguage.includes(SupportedLanguages.DE);

          if (isGerman) {
            // If there are no saved settings and the device language is german and currebcy to EUR
            activeDeviceLanguage = SupportedLanguages.DE;
            setActiveCurrency(SupportedCurrencies.EUR);
          }
          saveSettingsActiveLanguage(activeDeviceLanguage);
          saveSettingsActiveCurrency(
            isGerman ? SupportedCurrencies.EUR : SupportedCurrencies.USD
          );
        })();
      }

      setActiveLanguage(activeDeviceLanguage);
      registerNumeralFormat(activeDeviceLanguage);
      setAppIsReady(true);
    });
  };

  useEffect(() => {
    preload();
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

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <ActiveCurrencyContext.Provider
        value={[activeCurrency, setActiveCurrency]}
      >
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
    </View>
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
