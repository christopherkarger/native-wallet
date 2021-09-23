import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props) => {
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
        <Image style={styles.logo} source={props.data.icon.path}></Image>
        <AppText style={styles.cryptoName}>{props.data.name}</AppText>
        <AppText
          style={(() => {
            return props.data.percentage >= 0
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
          {props.data.percentage > 0 ? "+" : ""}
          {props.data.percentage}
        </AppText>
      </View>

      <View style={styles.amountWrapper}>
        <AppText style={styles.amount}>{props.data.walletAmount}</AppText>
        {!!props.data.currency && (
          <AppText style={styles.amountShort}>{props.data.currency}</AppText>
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
