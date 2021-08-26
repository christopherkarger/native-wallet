import React from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
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
    fontFamily: "roboto-black",
    marginBottom: 15,
  },
  yourCoinsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255, 0.1)",
    paddingTop: 14,
  },
  yourCoinLogo: {
    width: 25,
    height: 25,
  },
  yourCoin: {
    fontFamily: "roboto-black",
    fontSize: 15,
    marginLeft: 10,
  },
  yourCoinShort: {
    fontSize: 11,
    marginLeft: 10,
  },
});
export default Market;
