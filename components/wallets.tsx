import React from "react";
import { FlatList, StyleSheet } from "react-native";
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
            data={{
              name: "btc",
              amount: 0.1,
            }}
            style={index > 0 ? { marginLeft: 20 } : {}}
          ></WalletCard>
        );
      }}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  wallets: {
    marginBottom: 40,
  },
});

export default Wallets;
