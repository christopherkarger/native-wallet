import React, { useMemo } from "react";
import { FlatList, StyleSheet } from "react-native";
import { waitTime } from "~/services/helper";
import WalletCard from "./wallet-card";

const Wallets = (props) => {
  let flatListRef: FlatList<any> | null;

  const scrollToStart = async () => {
    if (flatListRef) {
      try {
        await waitTime(500);
        flatListRef.scrollToOffset({ animated: false, offset: 0 });
      } catch {
        console.error("could not scroll to start");
      }
    }
  };

  const List = useMemo(() => {
    return (
      <FlatList
        ref={(ref) => {
          flatListRef = ref;
        }}
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
              onCardClicked={scrollToStart}
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
