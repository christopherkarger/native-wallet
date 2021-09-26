import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import Button from "~/components/button";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { Colors, Fonts, PathNames } from "~/constants";
import { WalletWrapper } from "~/models/wallet-wrapper";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const [walletWrapper] = useState<WalletWrapper>(props.route.params.data);

  useEffect(() => {
    // console.log(111111111);
    // console.log(data);
  }, []);

  return (
    <SafeArea>
      <SubPageHeader navigation={props.navigation}>
        {walletWrapper.wallets[0].name}
      </SubPageHeader>
      <View style={styles.inner}>
        <View style={{ ...styles.center, ...styles.logoWrapper }}>
          <Image
            style={styles.logo}
            source={walletWrapper.wallets[0].icon.path}
          ></Image>
        </View>
        <FlatList
          contentContainerStyle={{}}
          keyboardShouldPersistTaps="handled"
          data={walletWrapper.wallets}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.singleWalletWrapper}>
                {index > 0 && <View style={styles.divider}></View>}
                <AppText>Adresse:</AppText>
                <AppText style={styles.address}>{item.address}</AppText>
                <AppText>Balance:</AppText>
                <AppText style={styles.balance}>
                  {item.balance} {item.currency}
                </AppText>
              </View>
            );
          }}
        ></FlatList>
        <Button
          onPress={() => {
            props.navigation.navigate(PathNames.addWallet, {
              addToWallet: true,
              currency: walletWrapper.wallets[0].currency,
              name: walletWrapper.wallets[0].name,
              id: walletWrapper.wallets[0].id,
            });
          }}
          text="Addresse zu diesem Wallet hinzufügen"
        ></Button>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
  },
  singleWalletWrapper: {
    marginBottom: 20,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  center: {
    width: "100%",
    alignItems: "center",
  },
  balance: {
    fontSize: 25,
    fontFamily: Fonts.bold,
  },
  address: {
    fontFamily: Fonts.bold,
    marginBottom: 20,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.lightWhite,
    marginBottom: 20,
  },
});

export default SingleWallet;
