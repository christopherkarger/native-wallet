import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import GradientView from "~/components/gradient-view";
import Market from "~/components/market";
import SafeArea from "~/components/safe-area";
import { selectLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { useUpdateLocalWalletBalances } from "~/hooks/update-local-wallet-balances";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  EURPriceContext,
  MarketDataContext,
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
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "../constants";

const HomeScreen = (props) => {
  const euroPrice = useContext(EURPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const [loading, setLoading] = useState(true);
  const [walletsData, setWalletsData] = useState<WalletWrapper[]>([]);
  const [totalBalance, setTotalBalance] = useState("0");
  const marketData: MarketData = useContext(MarketDataContext);
  const mounted = useIsMounted();

  useUpdateLocalWalletBalances();

  useEffect(() => {
    updateWallets();
    const sub = DeviceEventEmitter.addListener(
      UPDATE_WALLETS_EVENT,
      updateWallets
    );

    return () => {
      sub.remove();
    };
  }, []);

  useEffect(() => {
    setTotalBalance(
      formatNumberWithCurrency({
        number: calcTotalBalance(marketData, walletsData),
        language: activeLanguage,
        currency: activeCurrency,
        euroPrice: euroPrice,
      })
    );
  }, [marketData, walletsData, activeLanguage, activeCurrency, euroPrice]);

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
    setLoading(false);
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
          <Market
            navigation={props.navigation}
            data={marketData}
            ListHeaderComponent={
              <>
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
                  <View style={styles.showPortfolioButtonWrapper}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate(
                          PathNames.portfolioOverview,
                          walletsData.map((w) => w.clone())
                        );
                      }}
                    >
                      <View style={styles.showPortfolioButton}>
                        <FontAwesome5
                          name="chart-pie"
                          size={24}
                          color={Colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <WalletList
                    data={walletsData}
                    navigation={props.navigation}
                  ></WalletList>
                  <View style={styles.inner}></View>
                </View>
              </>
            }
          ></Market>
        )}
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    position: "relative",
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
  showPortfolioButtonWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 50,
    overflow: "hidden",
  },
  showPortfolioButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
