import React, { useContext, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { insertItemToLocalDBTableWallets } from "~/db";
import { ActiveLanguageContext, AppConfigContext } from "~/models/context";
import { Texts } from "~/texts";
import { Fonts, PathNames } from "../constants";
import Button from "./button";
import AppText from "./text";
import { TextButton } from "./text-button";

const EmptyWallets = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const appConfig = useContext(AppConfigContext);
  const [creatingDemo, setCreatingDemo] = useState(false);

  const createDemo = async () => {
    if (creatingDemo) {
      return;
    }
    setCreatingDemo(true);
    for (const coin of appConfig.supported) {
      try {
        const amount = Math.random() * 10;
        await insertItemToLocalDBTableWallets({
          name: coin.name,
          currency: coin.currency,
          balance: +amount.toFixed(2),
          isCoinWallet: false,
          isDemoAddress: true,
          lastFetched: new Date().getTime(),
          address: `gfde43dFFxb7hdmddsa7767d`,
          transactions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e, i) => {
            const change = Math.random() * e;
            return {
              balance_change: Math.random() >= 0.5 ? change * -1 : change,
              time: `${new Date(new Date().setDate(new Date().getDate() - i))}`,
              hash: "gfde43dFFxb7hdmddsa7767dgfde43dFFxb",
            };
          }),
        });
      } catch (err) {
        console.error(err);
        setCreatingDemo(false);
      }
    }

    setCreatingDemo(false);
    props.onDemoCreated();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        <Image
          style={styles.wallet}
          source={require("../assets/wallet.png")}
        ></Image>
        <View style={styles.addAssetWrapper}>
          <Button
            style={styles.addAsset}
            onPress={() => props.navigation.navigate(PathNames.addAsset)}
            text={Texts.addAsset[activeLanguage]}
          ></Button>
        </View>
      </View>
      <View style={styles.demoWrapper}>
        <AppText style={styles.demoText}>
          {Texts.tryOutApp[activeLanguage]}
        </AppText>
        <TextButton
          style={styles.demoLink}
          textStyle={styles.demoLinkText}
          text={Texts.demoAccount[activeLanguage]}
          onPress={() => createDemo()}
        ></TextButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  innerWrapper: {
    position: "relative",
    top: -40,
  },
  addAssetWrapper: {
    alignItems: "center",
  },
  addAsset: {
    marginTop: 20,
  },
  wallet: {
    width: 250,
    height: 200,
    resizeMode: "contain",
  },
  demoWrapper: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  demoText: {
    marginRight: 10,
  },
  demoLink: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  demoLinkText: {
    fontFamily: Fonts.bold,
  },
});

export default EmptyWallets;
