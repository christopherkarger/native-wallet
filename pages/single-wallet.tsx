import { MaterialIcons } from "@expo/vector-icons";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  EURPriceContext,
  MarketDataContext,
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

const SingleWalletScreen = (props) => {
  const euroPrice = useContext(EURPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const [walletWrapper, setWalletWrapper] = useState<WalletWrapper>(
    props.route.params.data
  );
  const [moneyBalance, setMoneyBalance] = useState("0");
  const marketData: MarketData = useContext(MarketDataContext);
  const mounted = useIsMounted();

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
          euroPrice: euroPrice,
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

  const renderedListItem = (listProps) => {
    return (
      <View style={styles.singleWalletWrapper}>
        <View style={styles.walletInner}>
          <AppText>{Texts.balance[activeLanguage]}</AppText>
          <AppText style={styles.balance}>
            {formatNumber({
              number: listProps.item.balance,
              decimal: "000000",
              language: activeLanguage,
            })}{" "}
            {listProps.item.currency}
          </AppText>

          {listProps.item.address && (
            <View style={[styles.wrapper, styles.addressWrapper]}>
              <AppText>{Texts.address[activeLanguage]}</AppText>
              <AppText style={styles.address}>{listProps.item.address}</AppText>
            </View>
          )}

          {listProps.item.lastFetched && (
            <View style={styles.wrapper}>
              <AppText>{Texts.updated[activeLanguage]}:</AppText>
              <DateTime
                style={styles.updatedDate}
                date={listProps.item.lastFetched}
                withTime={true}
              ></DateTime>
            </View>
          )}

          {listProps.item.address && (
            <TextButton
              style={styles.openQrCode}
              onPress={() => {
                setQrCodeAdress(listProps.item.address);
                setQrCodeModalVisible(true);
              }}
            >
              <MaterialIcons name="qr-code" size={24} color="white" />
            </TextButton>
          )}
        </View>

        <View style={styles.actionBar}>
          <TextButton
            style={styles.deleteWalletButton}
            onPress={() => {
              Alert.alert(
                "",
                Texts.deleteAddressMessage[activeLanguage],
                [
                  {
                    text: Texts.abort[activeLanguage],
                    onPress: () => {},
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      deleteItem(listProps.item, listProps.index);
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
  };

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
          renderItem={useMemo(
            () => renderedListItem,
            [walletWrapper, activeLanguage]
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <Image
                style={styles.logo}
                source={walletWrapper.wallets[0].icon.path}
              ></Image>

              <View style={styles.headerBalanceWrapper}>
                <AppText style={styles.headerBalance}>
                  {moneyBalance} {CurrencyIcon.icon(activeCurrency)}
                </AppText>
                <AppText style={styles.totalCurrencyBalance}>
                  {formatNumber({
                    number: walletWrapper.totalBalance,
                    decimal: "000000",
                    language: activeLanguage,
                  })}{" "}
                  {walletWrapper.wallets[0].currency}
                </AppText>
              </View>
            </View>
          }
          ListFooterComponent={
            <View>
              <Button
                onPress={() => {
                  props.navigation.navigate(PathNames.addWallet, {
                    isAddingTo: true,
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
  headerBalanceWrapper: {
    justifyContent: "center",
    marginLeft: 20,
  },
  headerBalance: {
    fontFamily: Fonts.bold,
    fontSize: 25,
  },
  totalCurrencyBalance: {
    fontSize: 15,
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
  },
  deleteWalletButton: {
    marginLeft: "auto",
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  wrapper: {
    flexDirection: "row",
    marginTop: 20,
  },
  addressWrapper: {
    flexDirection: "column",
  },
  updatedDate: {
    marginLeft: 5,
    fontFamily: Fonts.bold,
  },
});

export default SingleWalletScreen;
