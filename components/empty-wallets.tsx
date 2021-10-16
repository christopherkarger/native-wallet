import React, { useContext, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { insertItemToLocalDB } from "~/db";
import { AppConfig } from "~/models/context";
import { Colors, PathNames } from "../constants";
import Button from "./button";
import AppText from "./text";
import { TextButton } from "./text-button";

const EmptyWallets = (props) => {
  const appConfig = useContext(AppConfig);
  const [creatingDemo, setCreatingDemo] = useState(false);

  const createDemo = async () => {
    if (creatingDemo) {
      return;
    }
    setCreatingDemo(true);
    for (const coin of appConfig.supported) {
      try {
        await insertItemToLocalDB(
          coin.name,
          coin.currency,
          `gfde43dFFxb7hdmddsa7767d`,
          +(Math.random() * 10).toFixed(2),
          new Date().getTime(),
          undefined,
          1
        );
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
        <View style={styles.addWalletWrapper}>
          <Button
            style={styles.addWallet}
            onPress={() => props.navigation.navigate(PathNames.addWallet)}
            text="Wallet hinzufügen"
          ></Button>
        </View>
      </View>
      <View style={styles.demoWrapper}>
        <AppText style={styles.demoText}>App ausprobieren?</AppText>
        <TextButton
          text="Demo Account"
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
  addWalletWrapper: {
    alignItems: "center",
  },
  addWallet: {
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
    borderBottomWidth: 1,
    borderColor: Colors.white,
    paddingBottom: 2,
  },
  demoLinkText: {},
});

export default EmptyWallets;
