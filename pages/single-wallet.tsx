import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import Button from "~/components/button";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { TextButton } from "~/components/text-button";
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { deleteItemFromLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  MarketDataContext,
  USDPriceContext,
} from "~/models/context";
import { CurrencyIcon } from "~/models/currency-icon";
import { MarketData } from "~/models/market-data";
import { Wallet } from "~/models/wallet";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import {
  formatNumber,
  formatNumberWithCurrency,
} from "~/services/format-number";
import { Texts } from "~/texts";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const dollarPrice = useContext(USDPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const [walletWrapper, setWalletWrapper] = useState<WalletWrapper>(
    props.route.params.data
  );
  const [moneyBalance, setMoneyBalance] = useState("0");
  const marketData: MarketData = useContext(MarketDataContext);
  const mounted = useIsMounted();

  useEffect(() => {
    if (mounted.current) {
      setMoneyBalance(
        formatNumberWithCurrency({
          number: calcTotalBalance(marketData, [props.route.params.data]),
          language: activeLanguage,
          currency: activeCurrency,
          dollarPrice: dollarPrice,
        })
      );
    }
  }, [marketData, activeCurrency]);

  const deleteItem = useCallback(
    async (item: Wallet, index: number) => {
      await deleteItemFromLocalDBTableWallets(item, walletWrapper).catch(
        (err) => {
          console.error(err);
          throw new Error("Deleting wallet address from local DB failed");
        }
      );

      DeviceEventEmitter.emit(UPDATE_WALLETS_EVENT, true);

      const updatedWallets = walletWrapper.wallets.filter(
        (e, i) => i !== index
      );
      if (updatedWallets.length > 0 && mounted.current) {
        setWalletWrapper(new WalletWrapper(updatedWallets));
      } else {
        props.navigation.navigate(PathNames.home);
      }
    },
    [walletWrapper]
  );

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
              <AppText style={styles.headerPrice}>
                {moneyBalance} {CurrencyIcon.icon(activeCurrency)}
              </AppText>
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
                  <View style={styles.walletInner}>
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
                  </View>
                  <View style={styles.actionBar}>
                    <TextButton
                      style={styles.transactionsButton}
                      textStyle={styles.transactionsButtonText}
                      text={Texts.transactions[activeLanguage]}
                      onPress={() => {
                        props.navigation.navigate(PathNames.tranactions, {
                          transactions: item.transactions,
                          currency: item.currency,
                        });
                      }}
                    ></TextButton>
                    <TextButton
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
                      <MaterialIcons name="delete" size={20} color="white" />
                    </TextButton>
                  </View>
                </View>
              );
            }}
            ListFooterComponent={
              <View>
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
              </View>
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
    marginBottom: 25,
    backgroundColor: Colors.greyBlue,
    overflow: "hidden",
    borderRadius: 10,
  },
  walletInner: {
    paddingVertical: 12,
    paddingHorizontal: 15,
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
    width: 60,
    height: 60,
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
    marginLeft: "auto",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  deleteWalletButtonText: {
    color: Colors.fadeLight,
    fontFamily: Fonts.regular,
  },
  transactionsButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  transactionsButtonText: {
    fontFamily: Fonts.bold,
  },
  actionBar: {
    paddingVertical: 5,
    backgroundColor: Colors.lightGreyBlue,
    flexDirection: "row",
  },
});

export default SingleWallet;
