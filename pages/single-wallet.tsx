import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import Button from "~/components/button";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { Fonts, PathNames } from "~/constants";
import { ILocalWallet } from "~/db";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const [wallets] = useState<ILocalWallet[]>(props.route.params.data.wallets);

  useEffect(() => {
    // console.log(111111111);
    // console.log(data);
  }, []);

  return (
    <SafeArea>
      <SubPageHeader navigation={props.navigation}>
        {wallets[0].name}
      </SubPageHeader>
      <View style={styles.inner}>
        <View style={{ ...styles.center, ...styles.logoWrapper }}>
          <Image style={styles.logo} source={wallets[0].icon.path}></Image>
        </View>
        <FlatList
          contentContainerStyle={{}}
          keyboardShouldPersistTaps="handled"
          data={wallets}
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
              </View>
            );
          }}
        ></FlatList>
        <Button
          onPress={() => {
            props.navigation.navigate(PathNames.addWallet, {
              addToWallet: true,
              currency: wallets[0].currency,
              name: wallets[0].name,
              id: wallets[0].id,
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
    marginBottom: 20,
  },
  address: {
    fontFamily: Fonts.bold,
    marginBottom: 20,
  },
});

export default SingleWallet;
