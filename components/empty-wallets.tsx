import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { PathNames } from "../constants";
import Button from "./button";

const EmptyWallets = (props) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        <Image
          style={styles.wallet}
          source={require("../assets/wallet.png")}
        ></Image>
        <View style={styles.addWalletWrapper}>
          <Button
            style={styles.addWallet}
            onPress={() => props.navigation.navigate(PathNames.addWallet)}
            text="Wallet hinzufügen"
          ></Button>
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

  addWallet: {
    marginTop: 20,
  },
  wallet: {
    width: 250,
    height: 200,
    resizeMode: "contain",
  },
});

export default EmptyWallets;
