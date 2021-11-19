import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Button from "~/components/button";
import { DateTime } from "~/components/date-time";
import GradientView from "~/components/gradient-view";
import QrCodeModal from "~/components/qr-code-modal";
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
  const isFocused = useIsFocused();

  const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false);
  const [qrCodeAdress, setQrCodeAdress] = useState("");

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
      <QrCodeModal
        show={qrCodeModalVisible}
        onClose={() => {
          setQrCodeModalVisible(false);
        }}
        address={qrCodeAdress}
      ></QrCodeModal>
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
              <TouchableNativeFeedback
                useForeground={true}
                background={TouchableNativeFeedback.Ripple(
                  Colors.ripple,
                  false
                )}
                onPress={(e) => {
                  props.navigation.navigate(PathNames.transactions, {
                    transactions: item.transactions ?? [],
                    currency: item.currency,
                  });
                }}
              >
                <View style={styles.singleWalletWrapper}>
                  <View style={styles.walletInner}>
                    {item.address && (
                      <View>
                        <AppText>{Texts.address[activeLanguage]}</AppText>
                        <AppText style={styles.address}>{item.address}</AppText>
                      </View>
                    )}

                    {item.lastFetched && (
                      <View style={styles.updated}>
                        <AppText>{Texts.updated[activeLanguage]}:</AppText>
                        <DateTime
                          style={styles.updatedDate}
                          date={item.lastFetched}
                          withTime={true}
                        ></DateTime>
                      </View>
                    )}

                    <AppText>{Texts.balance[activeLanguage]}</AppText>
                    <AppText style={styles.balance}>
                      {formatNumber({
                        number: item.balance,
                        decimal: "000000",
                        language: activeLanguage,
                      })}{" "}
                      {item.currency}
                    </AppText>

                    {item.address && (
                      <TextButton
                        style={styles.openQrCode}
                        onPress={() => {
                          setQrCodeAdress(item.address);
                          setQrCodeModalVisible(true);
                        }}
                      >
                        <MaterialIcons name="qr-code" size={24} color="white" />
                      </TextButton>
                    )}
                  </View>

                  <View style={styles.actionBar}>
                    <AppText style={styles.transactionsButtonText}>
                      {Texts.transactions[activeLanguage]}
                    </AppText>

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
              </TouchableNativeFeedback>
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
  center: {
    width: "100%",
    alignItems: "center",
  },
  balance: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    flex: 1,
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
  transactionsButtonText: {
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 40,
    fontFamily: Fonts.bold,
  },
  actionBar: {
    paddingVertical: 5,
    backgroundColor: Colors.lightGreyBlue,
    flexDirection: "row",
  },
  openQrCode: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 13,
  },
  updated: {
    flexDirection: "row",
    marginBottom: 20,
  },
  updatedDate: {
    marginLeft: 5,
    fontFamily: Fonts.bold,
  },
});

export default SingleWallet;
