import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Wallet } from "~/models/wallet";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props) => {
  const data = props.data.wallets[0];
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    let amount = 0;
    props.data.wallets.forEach((w: Wallet) => {
      amount += w.balance;
    });
    setAmount(amount);
  }, [props.data.wallets]);

  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate(PathNames.singleWallet, {
          data: props.data,
        });
      }}
      style={{ ...styles.card, ...props.style }}
    >
      <View style={styles.cryptoWrapper}>
        <Image style={styles.logo} source={data.icon.path}></Image>
        <AppText style={styles.cryptoName}>{data.name}</AppText>
        <AppText
          style={(() => {
            return data.percentage >= 0
              ? {
                  ...styles.percentage,
                  ...styles.percentagePos,
                }
              : {
                  ...styles.percentage,
                  ...styles.percentageNeg,
                };
          })()}
        >
          {data.percentage > 0 ? "+" : ""}
          {data.percentage}
        </AppText>
      </View>

      <View style={styles.amountWrapper}>
        <AppText style={styles.amount}>{data.walletAmount(amount)}</AppText>
        {!!data.currency && (
          <AppText style={styles.amountShort}>{data.currency}</AppText>
        )}
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
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
  cryptoWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
  percentage: {
    fontSize: 14,
  },
  percentagePos: {
    color: Colors.green,
  },
  percentageNeg: {
    color: Colors.red,
  },
});

export default WalletCard;
