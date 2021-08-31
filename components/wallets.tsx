import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { Wallet } from "../models/wallet";
import WalletCard from "./wallet-card";

const Wallets = (props) => {
  return (
    <FlatList
      style={styles.wallets}
      horizontal={true}
      contentContainerStyle={{ paddingRight: 20, paddingLeft: 20 }}
      keyboardShouldPersistTaps="handled"
      data={props.data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => {
        return (
          <WalletCard
            data={new Wallet("Bitcoin", "BTC", "12.3232", 7.4)}
            style={index > 0 ? { marginLeft: 20 } : {}}
          ></WalletCard>
        );
      }}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  wallets: {
    marginBottom: 30,
    flexGrow: 0,
  },
});

export default Wallets;
