import React from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { Colors, Fonts } from "../constants";
import GraphLine from "./graph-line";
import AppText from "./text";

const Market = (props) => {
  return (
    <View style={styles.inner}>
      <AppText style={styles.yourCoinsHeadline}>Krypto Markt</AppText>

      <FlatList
        data={props.data}
        keyExtractor={(_, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => {
          return (
            <View style={styles.yourCoinsWrapper}>
              <Image
                style={styles.yourCoinLogo}
                source={require("../assets/icons/crypto/btc.png")}
              ></Image>

              <View>
                <AppText style={styles.yourCoin}>Bitcoin</AppText>
                <AppText style={styles.yourCoinShort}>BTC</AppText>
              </View>
              {Dimensions.get("window").width >= 400 && (
                <View style={styles.graph}>
                  <GraphLine
                    data={[10, 12, 14, 12, 13]}
                    width={200}
                    height={58}
                    lineColor={Colors.green}
                    strokeWidth={2}
                  ></GraphLine>
                </View>
              )}

              <View style={styles.priceWrapper}>
                <AppText style={styles.price}>51.234 €</AppText>
              </View>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  inner: {
    marginLeft: 20,
    marginRight: 20,
  },
  yourCoinsHeadline: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    marginBottom: 15,
  },
  yourCoinsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255, 0.1)",
    paddingTop: 12,
  },
  yourCoinLogo: {
    width: 36,
    height: 36,
  },
  yourCoin: {
    fontSize: 16,
    marginLeft: 12,
  },
  yourCoinShort: {
    fontSize: 14,
    marginLeft: 12,
    color: Colors.lightWhite,
  },
  priceWrapper: {
    marginLeft: "auto",
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: 20,
  },
  graph: {
    marginLeft: 23,
    transform: [{ translateY: 5 }],
  },
});
export default Market;
