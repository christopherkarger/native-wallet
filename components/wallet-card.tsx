import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { MarketDataContext } from "~/models/context";
import { MarketData } from "~/models/market-data";
import { calcTotalBalance } from "~/services/calc-balance";
import { formatNumber } from "~/services/format-number";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props) => {
  const data = props.data.wallets[0];
  const [amount, setAmount] = useState(props.data.totalBalance);
  const marketData: MarketData = useContext(MarketDataContext);
  const getWalletBalance = () => {
    return formatNumber({
      number: calcTotalBalance(marketData, [props.data]),
      decimal: 2,
    });
  };
  const [walletBalance, setWalletBalance] = useState(getWalletBalance());

  useEffect(() => {
    setAmount(props.data.totalBalance);
    setWalletBalance(getWalletBalance());
  }, [props.data.wallets]);

  useEffect(() => {
    setWalletBalance(getWalletBalance());
  }, [marketData]);
  return (
    <TouchableOpacity
      onPress={() => {
        props.onCardClicked();
        props.navigation.navigate(PathNames.singleWallet, {
          data: props.data,
        });
      }}
      style={{
        borderColor: props.data.mainColor,
        ...styles.card,
        ...props.style,
      }}
    >
      <View style={styles.cryptoWrapper}>
        <Image style={styles.logo} source={data.icon.path}></Image>
        <AppText style={styles.cryptoName}>{data.name}</AppText>
      </View>

      <View style={styles.amountWrapper}>
        <AppText style={styles.amount}>
          {props.data.niceBalance(amount)}
        </AppText>

        <AppText style={styles.amountShort}>{data.currency}</AppText>
      </View>
      <View style={styles.walletBalanceWrapper}>
        <AppText style={styles.walletBalance}>{walletBalance} €</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingTop: 13,
    width: 200,
    height: 130,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255, .13)",
    overflow: "hidden",
    borderWidth: 2,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    paddingTop: 5,
    paddingBottom: 8,
  },
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 25,
  },
  amountShort: {
    fontSize: 15,
    marginLeft: 10,
    color: Colors.lightWhite,
  },
  walletBalanceWrapper: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  walletBalance: {
    fontFamily: Fonts.bold,
  },
  cryptoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  cryptoName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    marginRight: "auto",
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
});

export default WalletCard;
