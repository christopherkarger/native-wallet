import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const EmptyWallets = (props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        <Image source={require("../assets/wallet.png")}></Image>
        <View style={styles.addWalletWrapper}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate(PathNames.addWallet)}
            style={styles.addWalletButton}
          >
            <AppText style={styles.addWalletText}>Wallet hinzufügen</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  innerWrapper: {
    position: "relative",
    top: -40,
  },

  addWalletWrapper: {
    alignItems: "center",
  },
  addWalletButton: {
    marginTop: 25,
    textAlign: "center",
    backgroundColor: Colors.green,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addWalletText: {
    fontFamily: Fonts.bold,
  },
});

export default EmptyWallets;
