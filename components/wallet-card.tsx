import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const WalletCard = (props) => {
  const data = props.data.wallets[0];
  const [amount, setAmount] = useState(props.data.totalBalance);

  useEffect(() => {
    setAmount(props.data.totalBalance);
  }, [props.data.wallets]);

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
    overflow: "hidden",
    borderWidth: 2,
  },
  amountWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    zIndex: 2,
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
