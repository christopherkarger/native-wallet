import React from "react";
import { Image, StyleSheet, View } from "react-native";
import GraphLine from "./graph-line";
import AppText from "./text";

const WalletCard = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>
      <View style={styles.amountWrapper}>
        <AppText style={styles.amount}>{props.data.amount}</AppText>
        <AppText style={styles.amountShort}>
          {props.data.name.toUpperCase()}
        </AppText>
      </View>

      <GraphLine
        data={[10, 12, 14, 12, 13]}
        width={310}
        height={60}
        lineColor="rgba(255, 255, 255, .25)"
        strokeWidth={2}
      ></GraphLine>
      <View style={styles.cryptoWrapper}>
        <Image
          style={styles.logo}
          source={require("../assets/icons/crypto/btc.png")}
        ></Image>
        <AppText style={styles.cryptoName}>Bitcoin</AppText>
        <AppText style={styles.percentage}>7,4%</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 15,
    paddingTop: 8,
    width: 215,
    height: 160,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255, .13)",
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  amount: {
    fontFamily: "roboto-black",
    fontSize: 25,
    marginBottom: 0,
  },
  amountShort: {
    fontSize: 15,
    marginLeft: 10,
  },
  cryptoWrapper: {
    paddingTop: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  cryptoName: {
    fontSize: 15,
    fontFamily: "roboto-black",
    marginRight: "auto",
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  percentage: {
    fontSize: 14,
  },
});

export default WalletCard;
