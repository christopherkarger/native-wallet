import React, { useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import GradientView from "~/components/gradient-view";
import Market from "~/components/market";
import SafeArea from "~/components/safe-area";
import { selectLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  MarketDataContext,
  USDPriceContext,
} from "~/models/context";
import { CurrencyIcon } from "~/models/currency-icon";
import { MarketData } from "~/models/market-data";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import { formatNumberWithCurrency } from "~/services/format-number";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import { Texts } from "~/texts";
import EmptyWallets from "../components/empty-wallets";
import AppText from "../components/text";
import WalletList from "../components/wallet-list";
import { Colors, Fonts, UPDATE_WALLETS_EVENT } from "../constants";

const HomeScreen = (props) => {
  const dollarPrice = useContext(USDPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const [loading, setIsloading] = useState(true);
  const [walletsData, setWalletsData] = useState<WalletWrapper[]>([]);
  const [totalBalance, setTotalBalance] = useState("0");
  const marketData: MarketData = useContext(MarketDataContext);
  const mounted = useIsMounted();

  //useUpdateLocalWalletBalances();

  useEffect(() => {
    updateWallets();
    DeviceEventEmitter.addListener(UPDATE_WALLETS_EVENT, (event) => {
      updateWallets();
    });
  }, []);

  useEffect(() => {
    setTotalBalance(
      formatNumberWithCurrency({
        number: calcTotalBalance(marketData, walletsData),
        language: activeLanguage,
        currency: activeCurrency,
        dollarPrice: dollarPrice,
      })
    );
  }, [marketData, walletsData, activeLanguage, activeCurrency, dollarPrice]);

  const updateWallets = async () => {
    if (!mounted.current) {
      return;
    }
    const localWallets = await selectLocalDBTableWallets().catch(() => {});
    if (localWallets && localWallets.rows.length) {
      setWalletsData(getWalletWrapper(localWallets.rows._array));
    } else {
      setWalletsData([]);
    }
    setIsloading(false);
  };

  if (loading) {
    return <GradientView></GradientView>;
  }

  return (
    <GradientView>
      <SafeArea>
        {walletsData.length === 0 && (
          <EmptyWallets
            navigation={props.navigation}
            onDemoCreated={updateWallets}
          ></EmptyWallets>
        )}
        {walletsData.length > 0 && (
          <View style={styles.inner}>
            <AppText style={styles.pfHeadline}>
              {Texts.portfolio[activeLanguage]}
            </AppText>
            <AppText style={styles.pfSubheadline}>
              {Texts.balance[activeLanguage]}
            </AppText>
            <AppText style={styles.balance}>
              {totalBalance} {CurrencyIcon.icon(activeCurrency)}
            </AppText>
          </View>
        )}

        {walletsData.length > 0 && (
          <View>
            <WalletList
              data={walletsData}
              navigation={props.navigation}
            ></WalletList>
            <View style={styles.inner}></View>
          </View>
        )}

        {walletsData.length > 0 && Object.keys(marketData).length > 0 && (
          <Market navigation={props.navigation} data={marketData}></Market>
        )}
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginLeft: 20,
    marginRight: 20,
  },
  pfHeadline: {
    fontSize: 35,
    lineHeight: 40,
    fontFamily: Fonts.bold,
  },
  pfSubheadline: {
    fontSize: 15,
    marginTop: 30,
    color: Colors.grey,
  },
  balance: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    position: "relative",
    top: -5,
    marginBottom: 15,
  },
  actionButtonWrapper: {
    flexDirection: "row",
    position: "absolute",
    top: 42,
    right: 20,
    alignItems: "center",
    zIndex: 10,
  },
  addWalletButtonWrapper: {
    overflow: "hidden",
    borderRadius: 20,
    width: 40,
    height: 40,
    marginLeft: 20,
  },
  addWalletButtonGradient: {
    width: "100%",
    height: "100%",
  },
  addWalletButtonIcon: {
    position: "absolute",
    top: 4,
    left: 5,
  },
});

export default HomeScreen;
