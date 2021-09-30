import React, { useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";
import Button from "~/components/button";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { Colors, Fonts, PathNames } from "~/constants";
import { deleteItemFromLocalDB } from "~/db";
import { WalletWrapper } from "~/models/wallet-wrapper";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const [walletWrapper, setWalletWrapper] = useState<WalletWrapper>(
    props.route.params.data
  );

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
                    const deleteItem = async () => {
                      await deleteItemFromLocalDB(item.id).catch((err) => {
                        console.log(err);
                        throw new Error(
                          "Deleting wallet address from local DB failed"
                        );
                      });

                      const updatetWallets = walletWrapper.wallets.filter(
                        (e, i) => i !== index
                      );
                      if (updatetWallets.length > 0) {
                        setWalletWrapper(new WalletWrapper(updatetWallets));
                      } else {
                        props.navigation.navigate(PathNames.home);
                      }
                    };

                    Alert.alert(
                      "",
                      "Möchtest du wirklich diese Adresse löschen?",
                      [
                        {
                          text: "Abbrechen",
                          onPress: () => {},
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            deleteItem();
                          },
                        },
                      ],
                      { cancelable: false }
                    );
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
