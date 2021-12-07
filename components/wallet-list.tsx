import React, { useEffect, useMemo } from "react";
import { DeviceEventEmitter, FlatList, StyleSheet } from "react-native";
import { UPDATE_WALLETS_EVENT } from "~/constants";
import { randomString } from "~/services/helper";
import WalletCard from "./wallet-card";

const Wallets = (props) => {
  let flatListRef: FlatList<any> | null;

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(UPDATE_WALLETS_EVENT, () => {
      flatListRef?.scrollToIndex({
        animated: false,
        index: 0,
      });
    });

    return () => {
      sub.remove();
    };
  }, []);

  const renderedListItem = (listProps) => (
    <WalletCard
      navigation={props.navigation}
      data={listProps.item}
      style={listProps.index > 0 ? { marginLeft: 20 } : {}}
      index={listProps.index}
    ></WalletCard>
  );

  return (
    <FlatList
      ref={(list) => {
        if (list) {
          flatListRef = list;
        }
      }}
      style={styles.wallets}
      horizontal={true}
      contentContainerStyle={{ paddingRight: 20, paddingLeft: 20 }}
      keyboardShouldPersistTaps="handled"
      data={props.data}
      keyExtractor={(_, index) => randomString(index)}
      renderItem={useMemo(() => renderedListItem, [props.data])}
      initialNumToRender={4}
      showsHorizontalScrollIndicator={false}
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
