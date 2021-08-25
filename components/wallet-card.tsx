import React from "react";
import { Image, StyleSheet, View } from "react-native";
import GraphLine from "./graph-line";
import AppText from "./text";

const WalletCard = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>
      <View style={styles.cardTop}>
        <Image
          style={styles.logo}
          source={require("../assets/icons/crypto/btc.png")}
        ></Image>
        <View>
          <AppText style={styles.cryptoName}>Bitcoin</AppText>
          <AppText style={styles.cryptoShort}>BTC</AppText>
        </View>
      </View>
      <GraphLine
        data={[10, 12, 14, 12, 13]}
        width={280}
        height={90}
        lineColor="rgba(255, 255, 255, .25)"
        strokeWidth={2}
      ></GraphLine>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    width: 200,
    height: 150,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255, .13)",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cryptoName: {
    fontSize: 15,
    fontFamily: "roboto-black",
  },
  cryptoShort: {
    fontSize: 12,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
});

export default WalletCard;
