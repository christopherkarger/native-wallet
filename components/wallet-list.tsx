import React, { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { randomString } from "~/services/helper";
import WalletCard from "./wallet-card";

const Wallets = (props) => {
  const renderItem = (listProps) => (
    <WalletCard
      navigation={props.navigation}
      data={listProps.item}
      style={listProps.index > 0 ? { marginLeft: 20 } : {}}
    ></WalletCard>
  );

  const memoizedListItem = useMemo(() => renderItem, [props.data]);

  return (
    <FlatList
      style={styles.wallets}
      horizontal={true}
      contentContainerStyle={{ paddingRight: 20, paddingLeft: 20 }}
      keyboardShouldPersistTaps="handled"
      data={props.data}
      keyExtractor={(_, index) => randomString() + index.toString()}
      renderItem={memoizedListItem}
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
