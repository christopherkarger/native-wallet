import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  MarketDataContext,
  USDPriceContext,
} from "~/models/context";
import { CurrencyIcon } from "~/models/currency-icon";
import { MarketData } from "~/models/market-data";
import { calcTotalBalance } from "~/services/calc-balance";
import {
  formatNumber,
  formatNumberWithCurrency,
} from "~/services/format-number";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props) => {
  const dollarPrice = useContext(USDPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const data = props.data.wallets[0];
  const [amount, setAmount] = useState(props.data.totalBalance);
  const marketData: MarketData = useContext(MarketDataContext);
  const getWalletBalance = () => {
    return formatNumberWithCurrency({
      number: calcTotalBalance(marketData, [props.data]),
      language: activeLanguage,
      currency: activeCurrency,
      dollarPrice: dollarPrice,
    });
  };
  const [walletBalance, setWalletBalance] = useState(getWalletBalance());

  useEffect(() => {
    setAmount(props.data.totalBalance);
    setWalletBalance(getWalletBalance());
  }, [props.data.wallets, activeLanguage]);

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
        <AppText style={styles.currency}>{data.currency}</AppText>
      </View>
      <AppText style={styles.walletBalance}>
        {walletBalance} {CurrencyIcon.icon(activeCurrency)}
      </AppText>
      <Image style={styles.logo} source={data.icon.path}></Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingTop: 13,
    width: 210,
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
  currency: {
    fontSize: 15,
    marginLeft: 10,
    color: Colors.grey,
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
