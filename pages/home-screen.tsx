import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import GradientView from "~/components/gradient-view";
import Market from "~/components/market";
import SafeArea from "~/components/safe-area";
import { TextButton } from "~/components/text-button";
import { resetLocalDbWallets, selectLocalDBTableWallets } from "~/db";
import { useUpdateLocalWalletBalances } from "~/hooks/update-local-wallet-balances";
import { MarketDataContext } from "~/models/context";
import { MarketData } from "~/models/market-data";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import { formatNumber } from "~/services/format-number";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import EmptyWallets from "../components/empty-wallets";
import AppText from "../components/text";
import WalletList from "../components/wallet-list";
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "../constants";

const HomeScreen = (props) => {
  const [loading, setIsloading] = useState(true);
  const [walletsData, setWalletsData] = useState<WalletWrapper[]>([]);
  const [totalBalance, setTotalBalance] = useState("0");
  const marketData: MarketData = useContext(MarketDataContext);
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const [isDeletingDemoAccount, setIsDeletingDemoAccount] = useState(false);

  useUpdateLocalWalletBalances();

  const deleteDemo = async () => {
    if (isDeletingDemoAccount) {
      return;
    }
    setIsDeletingDemoAccount(true);
    try {
      setWalletsData([]);
      await resetLocalDbWallets();
    } catch (err) {
      updateWallets();
      console.error(err);
    } finally {
      setIsDeletingDemoAccount(false);
    }
  };

  useEffect(() => {
    updateWallets();
    DeviceEventEmitter.addListener(UPDATE_WALLETS_EVENT, (event) => {
      updateWallets();
    });
  }, []);

  useEffect(() => {
    setTotalBalance(
      formatNumber({
        number: calcTotalBalance(marketData, walletsData),
      })
    );
  }, [marketData, walletsData]);

  const updateWallets = async () => {
    const localWallets = await selectLocalDBTableWallets().catch(() => {});
    if (localWallets && localWallets.rows.length) {
      setWalletsData(getWalletWrapper(localWallets.rows._array));
      setIsDemoAccount(localWallets.rows._array.some((x) => x.demoAddress));
    } else {
      setWalletsData([]);
      setIsDemoAccount(false);
    }
    setIsloading(false);
  };

  if (loading) {
    return <GradientView></GradientView>;
  }

  return (
    <GradientView>
      <SafeArea>
        {walletsData.length > 0 && (
          <View style={styles.actionButtonWrapper}>
            {isDemoAccount && (
              <TextButton
                text="Demo löschen"
                onPress={() => deleteDemo()}
              ></TextButton>
            )}
            <View style={styles.addWalletButtonWrapper}>
              <TouchableOpacity
                onPress={() => props.navigation.navigate(PathNames.addWallet)}
              >
                <LinearGradient
                  style={styles.addWalletButtonGradient}
                  colors={[Colors.lightBlue, Colors.purple]}
                >
                  <MaterialIcons
                    style={styles.addWalletButtonIcon}
                    name="add"
                    size={30}
                    color={Colors.white}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {walletsData.length === 0 && (
          <EmptyWallets
            navigation={props.navigation}
            onDemoCreated={() => updateWallets()}
          ></EmptyWallets>
        )}
        {walletsData.length > 0 && (
          <View style={styles.inner}>
            <AppText style={styles.pfHeadline}>Portfolio</AppText>
            <AppText style={styles.pfSubheadline}>Guthaben</AppText>
            <AppText style={styles.balance}>{totalBalance} €</AppText>
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
    color: Colors.lightWhite,
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
