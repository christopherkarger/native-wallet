import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SafeArea from "~/components/safe-area";
import { selectLocalDBTable } from "~/db";
import { useUpdateLocalWalletBalances } from "~/hooks/update-local-wallet-balances";
import { MarketData } from "~/models/context";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import EmptyWallets from "../components/empty-wallets";
import AppText from "../components/text";
import WalletList from "../components/wallet-list";
import { Colors, Fonts, PathNames } from "../constants";
let counter = 0;
const HomeScreen = (props) => {
  const [walletsData, setWalletsData] = useState<WalletWrapper[]>([]);
  const [totalBalance, setTotalBalance] = useState("0");
  const marketData = useContext(MarketData);
  useUpdateLocalWalletBalances();

  useEffect(() => {
    const routeListener = props.navigation.addListener("focus", async () => {
      const localWallets = await selectLocalDBTable().catch(() => {});
      if (localWallets && localWallets.rows.length) {
        setWalletsData(getWalletWrapper(localWallets.rows._array));
      }
    });

    return () => {
      routeListener();
    };
  }, []);

  useEffect(() => {
    setTotalBalance(calcTotalBalance(marketData, walletsData));
  }, [marketData, walletsData]);

  return (
    <SafeArea>
      {walletsData.length > 0 && (
        <View style={styles.addWalletButtonWrapper}>
          <TouchableOpacity
            style={styles.addWalletButton}
            onPress={() => props.navigation.navigate(PathNames.addWallet)}
          >
            <MaterialIcons name="add-circle" size={40} color={Colors.green} />
          </TouchableOpacity>
        </View>
      )}

      {walletsData.length === 0 && (
        <EmptyWallets navigation={props.navigation}></EmptyWallets>
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

      {/* {walletsData.length > 0 && marketData.length > 0 && (
        <Market data={marketData}></Market>
      )} */}
    </SafeArea>
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
  addWalletButtonWrapper: {
    position: "absolute",
    top: 35,
    right: 10,
    zIndex: 10,
  },
  addWalletButton: {},
});

export default HomeScreen;
