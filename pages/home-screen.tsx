import React from "react";
import { StyleSheet, View } from "react-native";
import EmptyWallets from "../components/empty-wallets";
import Market from "../components/market";
import AppText from "../components/text";
import Wallets from "../components/wallets";
import { Colors, Fonts } from "../constants";
import { Wallet } from "../models/wallet";

const HomeScreen = (props) => {
  const walletsData: Wallet[] = [
    new Wallet("Bitcoin", "BTC", 12.3232, 7.4),
    new Wallet("Cardano", "ADA", 503.444, 7.4),
    new Wallet("Ethereum", "ETH", 0.1, 7.4),
    new Wallet("Dogecoin", "DOGE", 0.533, 7.4),
    new Wallet("Litecoin", "LTC", 5000.3232, 7.4),
  ];
  const marketData: any[] = [];

  return (
    <>
      {walletsData.length === 0 && (
        <EmptyWallets navigation={props.navigation}></EmptyWallets>
      )}

      {walletsData.length > 0 && (
        <View style={styles.inner}>
          <AppText style={styles.pfHeadline}>Portfolio</AppText>
          <AppText style={styles.pfSubheadline}>Balance</AppText>
          <AppText style={styles.balance}>7.334 €</AppText>
        </View>
      )}

      {walletsData.length > 0 && <Wallets data={walletsData}></Wallets>}
      {walletsData.length > 0 && marketData.length > 0 && (
        <Market data={marketData}></Market>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginLeft: 20,
    marginRight: 20,
  },
  pfHeadline: {
    fontSize: 40,
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
});

export default HomeScreen;
