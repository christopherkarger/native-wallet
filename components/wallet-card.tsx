import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActiveLanguage, MarketDataContext } from "~/models/context";
import { MarketData } from "~/models/market-data";
import { calcTotalBalance } from "~/services/calc-balance";
import { formatNumber } from "~/services/format-number";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props) => {
  const activeLanguage = useContext(ActiveLanguage);
  const data = props.data.wallets[0];
  const [amount, setAmount] = useState(props.data.totalBalance);
  const marketData: MarketData = useContext(MarketDataContext);
  const getWalletBalance = () => {
    return formatNumber({
      number: calcTotalBalance(marketData, [props.data]),
      language: activeLanguage,
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
        props.navigation.navigate(PathNames.singleWallet, {
          data: props.data,
          formatedBalance: walletBalance,
        });
      }}
      style={{
        borderColor: props.data.mainColor,
        ...styles.card,
        ...props.style,
      }}
    >
      <View style={styles.amountWrapper}>
        <AppText style={styles.amount}>
          {formatNumber({
            number: amount,
            language: activeLanguage,
          })}
        </AppText>
        <AppText style={styles.amountShort}>{data.currency}</AppText>
      </View>
      <AppText style={styles.walletBalance}>{walletBalance} €</AppText>
      <Image style={styles.logo} source={data.icon.path}></Image>
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
    paddingTop: 8,
    marginBottom: 5,
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
  walletBalance: {
    fontFamily: Fonts.bold,
  },
  cryptoWrapper: {
    flexDirection: "row",
  },
  cryptoName: {
    fontSize: 15,
    fontFamily: Fonts.bold,
    marginRight: "auto",
  },
  logo: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    //marginRight: 12,
  },
});

export default WalletCard;
