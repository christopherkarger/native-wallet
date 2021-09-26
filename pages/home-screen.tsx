import { MaterialIcons } from "@expo/vector-icons";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SafeArea from "~/components/safe-area";
import { selectLocalDBTable } from "~/db";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { fetchMarketData, IMarketData } from "~/services/fetch-marketdata";
import { getWalletWrapper } from "~/services/getWalletWrapper";
import EmptyWallets from "../components/empty-wallets";
import AppText from "../components/text";
import WalletList from "../components/wallet-list";
import { Colors, Fonts, PathNames } from "../constants";

const HomeScreen = (props) => {
  const [walletsData, setWalletsData] = useState<WalletWrapper[]>([]);
  const [firebaseDb, setFirebaseDb] = useState<firebase.database.Reference>();
  const [marketData, setMarketData] = useState<IMarketData>();

  useEffect(() => {
    fetchMarketData((data, db) => {
      if (!firebaseDb) {
        setFirebaseDb(db);
      }
      setMarketData(data);
    });

    const routeSub = props.navigation.addListener("focus", () => {
      (async () => {
        const localWallets = await selectLocalDBTable().catch(() => {});
        if (localWallets && localWallets.rows.length) {
          setWalletsData(getWalletWrapper(localWallets.rows._array));
        }
      })();
    });

    return () => {
      routeSub();
      firebaseDb?.off();
    };
  }, []);

  return (
    <SafeArea>
      {walletsData.length === 0 && (
        <EmptyWallets navigation={props.navigation}></EmptyWallets>
      )}
      {walletsData.length > 0 && (
        <View style={styles.inner}>
          <AppText style={styles.pfHeadline}>Portfolio</AppText>
          <AppText style={styles.pfSubheadline}>Balance</AppText>
          <AppText style={styles.balance}>7.334 €</AppText>
        </View>
      )}

      {walletsData.length > 0 && (
        <View>
          <WalletList
            data={walletsData}
            navigation={props.navigation}
          ></WalletList>
          <View style={styles.inner}></View>
        </View>
      )}

      {/* {walletsData.length > 0 && marketData.length > 0 && (
        <Market data={marketData}></Market>
      )} */}

      {walletsData.length > 0 && (
        <View style={styles.addWalletButtonWrapper}>
          <TouchableOpacity
            style={styles.addWalletButton}
            onPress={() => props.navigation.navigate(PathNames.addWallet)}
          >
            <MaterialIcons name="add-circle" size={50} color={Colors.green} />
          </TouchableOpacity>
        </View>
      )}
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginLeft: 20,
    marginRight: 20,
  },
  pfHeadline: {
    fontSize: 40,
    lineHeight: 40,
    fontFamily: Fonts.bold,
  },
  pfSubheadline: {
    fontSize: 15,
    marginTop: 30,
    color: Colors.lightWhite,
  },
  balance: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    position: "relative",
    top: -5,
    marginBottom: 15,
  },
  addWalletButtonWrapper: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addWalletButton: {},
});

export default HomeScreen;
