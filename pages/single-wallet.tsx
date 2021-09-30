import React, { useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import Button from "~/components/button";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { Colors, Fonts, PathNames } from "~/constants";
import { WalletWrapper } from "~/models/wallet-wrapper";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const [walletWrapper] = useState<WalletWrapper>(props.route.params.data);

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
                <AppText>Adresse:</AppText>
                <AppText style={styles.address}>{item.address}</AppText>
                <AppText>Balance:</AppText>
                <AppText style={styles.balance}>
                  {item.balance} {item.currency}
                </AppText>
                <Button
                  style={styles.deleteWalletButton}
                  textStyle={styles.deleteWalletButtonText}
                  onPress={() => {
                    console.log("delete item", index);
                  }}
                  text="Entfernen"
                ></Button>
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
    borderBottomColor: Colors.white,
    borderBottomWidth: 1,
    paddingBottom: 20,
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
  deleteWalletButton: {
    marginTop: 10,
    marginBottom: 0,
    backgroundColor: Colors.transparent,
    color: Colors.green,
    width: "auto",
    paddingLeft: 0,
  },
  deleteWalletButtonText: {
    color: Colors.fadeLight,
  },
});

export default SingleWallet;
