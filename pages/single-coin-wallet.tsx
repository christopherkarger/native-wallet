import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Button from "~/components/button";
import { DateTime } from "~/components/date-time";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { TextButton } from "~/components/text-button";
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import {
  deleteItemFromLocalDBTableWallets,
  selectLocalDBTableWallets,
} from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { UPDATE_WALLETS_EVENT_TYPE } from "~/hooks/update-local-wallet-balances";
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
import { getWalletWrapper } from "~/services/getWalletWrapper";
import { Texts } from "~/texts";
import AppText from "../components/text";

const SingleCoinWalletScreen = (props) => {
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
    const subscription = DeviceEventEmitter.addListener(
      UPDATE_WALLETS_EVENT,
      async (event) => {
        if (
          event == UPDATE_WALLETS_EVENT_TYPE.Update ||
          event == UPDATE_WALLETS_EVENT_TYPE.Add
        ) {
          const localWallets = await selectLocalDBTableWallets().catch(
            () => {}
          );
          if (localWallets && localWallets.rows.length) {
            const walletWrapper = getWalletWrapper(localWallets.rows._array);

            if (props.route.params.index !== undefined && mounted.current) {
              setWalletWrapper(walletWrapper[props.route.params.index]);
            }
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      setMoneyBalance(
        formatNumberWithCurrency({
          number: calcTotalBalance(marketData, [walletWrapper]),
          language: activeLanguage,
          currency: activeCurrency,
          dollarPrice: dollarPrice,
        })
      );
    }
  }, [marketData, activeCurrency, walletWrapper]);

  const deleteItem = useCallback(
    async (item: Wallet, index: number) => {
      await deleteItemFromLocalDBTableWallets(item, walletWrapper).catch(
        (err) => {
          console.error(err);
          throw new Error("Deleting wallet address from local DB failed");
        }
      );

      DeviceEventEmitter.emit(
        UPDATE_WALLETS_EVENT,
        UPDATE_WALLETS_EVENT_TYPE.Delete
      );

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
        <FlatList
          contentContainerStyle={{
            paddingRight: 20,
            paddingLeft: 20,
            paddingBottom: 20,
          }}
          style={styles.flatList}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          data={walletWrapper.wallets}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.singleWalletWrapper}>
                <View style={styles.walletInner}>
                  <AppText>{Texts.balance[activeLanguage]}</AppText>
                  <AppText style={styles.balance}>
                    {formatNumber({
                      number: item.balance,
                      decimal: "000000",
                      language: activeLanguage,
                    })}{" "}
                    {item.currency}
                  </AppText>

                  <View style={styles.wrapper}>
                    <AppText>{Texts.addedAt[activeLanguage]}:</AppText>
                    <DateTime
                      style={styles.addedInfo}
                      date={item.addedAt}
                      withTime={true}
                    ></DateTime>
                  </View>

                  {item.coinPrice !== undefined && (
                    <View style={styles.wrapper}>
                      <AppText>{Texts.pricePerCoin[activeLanguage]}:</AppText>
                      <AppText style={styles.addedInfo}>
                        {formatNumberWithCurrency({
                          number: item.coinPrice,
                          language: activeLanguage,
                          currency: activeCurrency,
                          dollarPrice: dollarPrice,
                        })}{" "}
                        {CurrencyIcon.icon(activeCurrency)}
                      </AppText>
                    </View>
                  )}
                </View>

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
            );
          }}
          ListHeaderComponent={
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
          }
          ListFooterComponent={
            <View>
              <Button
                onPress={() => {
                  props.navigation.navigate(PathNames.addCoin, {
                    isAddingTo: true,
                    currency: walletWrapper.wallets[0].currency,
                    name: walletWrapper.wallets[0].name,
                    id: walletWrapper.wallets[0].id,
                  });
                }}
                text={Texts.addCoinToWallet[activeLanguage]}
              ></Button>
            </View>
          }
        ></FlatList>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
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
    paddingLeft: 15,
    paddingRight: 50,
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
  balance: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    flex: 1,
  },
  deleteWalletButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 13,
  },
  wrapper: {
    flexDirection: "row",
    marginTop: 20,
  },
  addedInfo: {
    marginLeft: 5,
    fontFamily: Fonts.bold,
  },
});

export default SingleCoinWalletScreen;
