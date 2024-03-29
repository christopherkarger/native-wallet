import React, { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  EURPriceContext,
  MarketDataContext,
} from "~/models/context";
import { CurrencyIcon } from "~/models/currency-icon";
import { MarketData } from "~/models/market-data";
import { INavigation, IStyle } from "~/models/models";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import {
  formatNumber,
  formatNumberWithCurrency,
} from "~/services/format-number";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props: {
  data: WalletWrapper;
  navigation: INavigation;
  index: number;
  style: IStyle;
}) => {
  const euroPrice = useContext(EURPriceContext);
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
      euroPrice: euroPrice,
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
    <TouchableNativeFeedback
      useForeground={true}
      background={TouchableNativeFeedback.Ripple(Colors.ripple, false)}
      onPress={() => {
        props.navigation.navigate(PathNames.singleWallet, {
          data: props.data,
          index: props.index,
        });
      }}
    >
      <View
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
              maxChar: 9,
            })}
          </AppText>
          <AppText style={styles.currency}>{data.currency}</AppText>
        </View>
        <AppText style={styles.walletBalance}>
          {walletBalance} {CurrencyIcon.icon(activeCurrency)}
        </AppText>
        <Image style={styles.logo} source={data.icon.path}></Image>
      </View>
    </TouchableNativeFeedback>
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
    fontSize: 23,
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
