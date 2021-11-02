import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "~/components/button";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { deleteItemFromLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { ActiveLanguageContext, MarketDataContext } from "~/models/context";
import { MarketData } from "~/models/market-data";
import { Wallet } from "~/models/wallet";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import { formatNumber } from "~/services/format-number";
import { Texts } from "~/texts";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [walletWrapper, setWalletWrapper] = useState<WalletWrapper>(
    props.route.params.data
  );
  const [moneyBalance, setMoneyBalance] = useState("0");
  const marketData: MarketData = useContext(MarketDataContext);
  const mounted = useIsMounted();

  useEffect(() => {
    if (mounted.current) {
      setMoneyBalance(
        formatNumber({
          number: calcTotalBalance(marketData, [props.route.params.data]),
          language: activeLanguage,
        })
      );
    }
  }, [marketData]);

  const deleteItem = async (item: Wallet, index: number) => {
    await deleteItemFromLocalDBTableWallets(item, walletWrapper).catch(
      (err) => {
        console.error(err);
        throw new Error("Deleting wallet address from local DB failed");
      }
    );

    DeviceEventEmitter.emit(UPDATE_WALLETS_EVENT, true);

    const updatetWallets = walletWrapper.wallets.filter((e, i) => i !== index);
    if (updatetWallets.length > 0 && mounted.current) {
      setWalletWrapper(new WalletWrapper(updatetWallets));
    } else {
      props.navigation.navigate(PathNames.home);
    }
  };

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {walletWrapper.wallets[0].name} {Texts.wallet[activeLanguage]}
        </SubPageHeader>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={walletWrapper.wallets[0].icon.path}
            ></Image>

            <View style={styles.headerPriceWrapper}>
              <AppText style={styles.headerPrice}>{moneyBalance} €</AppText>
            </View>
          </View>
          <FlatList
            style={styles.flatList}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            data={walletWrapper.wallets}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <View style={styles.singleWalletWrapper}>
                  <AppText>{Texts.address[activeLanguage]}</AppText>
                  <AppText style={styles.address}>{item.address}</AppText>
                  <AppText>{Texts.balance[activeLanguage]}</AppText>
                  <AppText style={styles.balance}>
                    {formatNumber({
                      number: item.balance,
                      decimal: "000000",
                      language: activeLanguage,
                    })}{" "}
                    {item.currency}
                  </AppText>
                  <TouchableOpacity
                    style={styles.deleteWalletButton}
                    onPress={() => {
                      Alert.alert(
                        "",
                        Texts.deleteAddressHeadline[activeLanguage],
                        [
                          {
                            text: Texts.abort[activeLanguage],
                            onPress: () => {},
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () => {
                              deleteItem(item, index);
                            },
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  >
                    <AppText>{Texts.delete[activeLanguage]}</AppText>
                  </TouchableOpacity>
                </View>
              );
            }}
            ListFooterComponent={
              <Button
                onPress={() => {
                  props.navigation.navigate(PathNames.addWallet, {
                    addToWallet: true,
                    currency: walletWrapper.wallets[0].currency,
                    name: walletWrapper.wallets[0].name,
                    id: walletWrapper.wallets[0].id,
                  });
                }}
                text={Texts.addAddressToWallet[activeLanguage]}
              ></Button>
            }
          ></FlatList>
        </View>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  singleWalletWrapper: {
    marginBottom: 20,
    borderBottomColor: Colors.lightWhite,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  headerPriceWrapper: {
    justifyContent: "center",
    marginLeft: 20,
  },
  headerPrice: {
    fontFamily: Fonts.bold,
    fontSize: 25,
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
    fontFamily: Fonts.regular,
  },
});

export default SingleWallet;
