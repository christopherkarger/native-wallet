import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import Button from "~/components/button";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { SupportedCoins, SupportedWallets } from "~/config";
import { Colors, PathNames } from "~/constants";
import { ActiveLanguageContext } from "~/models/context";
import { Texts } from "~/texts";

const AddAssetScreen = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {Texts.addAsset[activeLanguage]}
        </SubPageHeader>
        <View style={styles.inner}>
          <View style={styles.addAssetButtonWrapper}>
            <AppText style={styles.addHeadline}>
              {Texts.addWalletHeadline[activeLanguage]}
            </AppText>
            <AppText style={styles.subHeadline}>
              {SupportedWallets.length}{" "}
              {SupportedWallets.length === 1
                ? Texts.supportedCryptocurrency[activeLanguage]
                : Texts.supportedCryptocurrencies[activeLanguage]}
            </AppText>
            <Button
              style={styles.addAssetButton}
              onPress={() => props.navigation.navigate(PathNames.addWallet)}
            >
              <AppText>{Texts.addWallet[activeLanguage]}</AppText>
            </Button>

            <AppText style={styles.addHeadline}>
              {Texts.addCoinHeadline[activeLanguage]}
            </AppText>
            <AppText style={styles.subHeadline}>
              {SupportedCoins.length}{" "}
              {SupportedCoins.length === 0
                ? Texts.supportedCryptocurrency[activeLanguage]
                : Texts.supportedCryptocurrencies[activeLanguage]}
            </AppText>
            <Button
              style={styles.addAssetButton}
              onPress={() => props.navigation.navigate(PathNames.addCoin)}
            >
              <AppText>{Texts.addCoin[activeLanguage]}</AppText>
            </Button>
          </View>
        </View>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
  },
  addAssetButtonWrapper: {
    alignItems: "center",
  },
  addAssetButton: {
    marginBottom: 20,
  },
  addHeadline: {
    paddingTop: 40,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 5,
  },
  subHeadline: {
    marginBottom: 25,
    color: Colors.grey,
  },
});

export default AddAssetScreen;
