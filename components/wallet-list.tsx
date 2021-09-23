import React, { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import WalletCard from "./wallet-card";

const Wallets = (props) => {
  const List = useMemo(() => {
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
              navigation={props.navigation}
              data={item}
              style={index > 0 ? { marginLeft: 20 } : {}}
            ></WalletCard>
          );
        }}
      ></FlatList>
    );
  }, [props.data]);

  return List;
};

const styles = StyleSheet.create({
  wallets: {
    marginBottom: 30,
    flexGrow: 0,
  },
});

export default Wallets;
