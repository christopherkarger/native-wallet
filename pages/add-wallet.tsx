import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AddCryptoModal from "~/components/add-crypto-modal";
import AlertModal from "~/components/alert-modal";
import Button from "~/components/button";
import DismissKeyboard from "~/components/dismiss-keyboard";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { SupportedWallets } from "~/config";
import { Colors, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { getExistingWalletId, insertItemToLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { UPDATE_WALLETS_EVENT_TYPE } from "~/hooks/update-local-wallet-balances";
import { ActiveLanguageContext, MarketDataContext } from "~/models/context";
import { MarketData } from "~/models/market-data";
import { fetchAddress } from "~/services/fetch-address";
import { Texts } from "~/texts";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const mounted = useIsMounted();
  const [nameChangeAllowed, setNameChangeAllowed] = useState(true);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [address, setEnteredAddress] = useState("");
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [existingWallet, setExistingWallet] =
    useState<{ name: string; id: number }>();
  const [fetchingAndSavingAddress, setFetchingAndSavingAddress] =
    useState(false);
  const [connectedToId, setConnectedToId] = useState<number>();
  const marketData: MarketData = useContext(MarketDataContext);
  const [errorAddingWalletModal, setErrorAddingWalletModal] = useState(false);

  useEffect(() => {
    if (props.route.params && props.route.params.address) {
      setEnteredAddress(props.route.params.address);
    }
  }, [props.route.params]);

  useEffect(() => {
    if (props.route.params && props.route.params.isAddingTo) {
      setConnectedToId(props.route.params.id);
      setName(props.route.params.name);
      setCurrency(props.route.params.currency);
      setNameChangeAllowed(false);
    }
  }, []);

  const addWallet = async () => {
    Keyboard.dismiss();

    if (fetchingAndSavingAddress || !name || !address) {
      return;
    }

    let balance = 0;

    try {
      setFetchingAndSavingAddress(true);
      const fetchedAddress = await fetchAddress(address.trim(), name);
      balance = fetchedAddress.balance;
    } catch (err) {
      console.error(err);
      setFetchingAndSavingAddress(false);
      setErrorAddingWalletModal(true);
      return;
    }

    if (mounted.current) {
      const marketItem = marketData.findItemByName(name);
      try {
        await insertItemToLocalDBTableWallets({
          name: name,
          currency: currency,
          balance: balance,
          isCoinWallet: false,
          isDemoAddress: false,
          addedAt: new Date().getTime(),
          coinPrice: marketItem ? marketItem.data.price : undefined,
          address: address.trim(),
          lastFetched: new Date().getTime(),
          connectedToId: connectedToId,
        });
        DeviceEventEmitter.emit(
          UPDATE_WALLETS_EVENT,
          UPDATE_WALLETS_EVENT_TYPE.Add
        );
        if (nameChangeAllowed) {
          props.navigation.navigate(PathNames.home);
        } else {
          props.navigation.goBack();
        }
      } catch (err) {
        setFetchingAndSavingAddress(false);
        console.error("Insert Wallet into DB failed");
        console.error(err);
      }
    }
  };

  return (
    <GradientView>
      <SafeArea>
        <DismissKeyboard>
          <View style={styles.page}>
            <SubPageHeader navigation={props.navigation}>
              {Texts.addNewWallet[activeLanguage]}
            </SubPageHeader>

            <View style={styles.inner}>
              <TouchableOpacity
                disabled={!nameChangeAllowed}
                onPress={() => {
                  if (nameChangeAllowed) {
                    setShowCryptoModal(true);
                  }
                }}
              >
                <View style={styles.cryptoInput}>
                  <AppText>
                    {name ? name : Texts.chooseCrypto[activeLanguage]}
                  </AppText>
                </View>
              </TouchableOpacity>
              <View>
                <View style={styles.qrCodeButtonWrapper}>
                  <TouchableOpacity
                    disabled={props.disabled}
                    onPress={() =>
                      props.navigation.navigate(PathNames.scanCode)
                    }
                    style={styles.qrCodeButton}
                  >
                    <MaterialIcons name="qr-code" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.cryptoInput}
                  placeholder={Texts.address[activeLanguage]}
                  placeholderTextColor={Colors.white}
                  onChangeText={setEnteredAddress}
                  value={address}
                  editable={!fetchingAndSavingAddress}
                ></TextInput>
              </View>

              <Button
                onPress={() => addWallet()}
                style={styles.addWallet}
                disabled={!name || !address || fetchingAndSavingAddress}
                text={
                  fetchingAndSavingAddress
                    ? Texts.loadingWallet[activeLanguage]
                    : Texts.addWallet[activeLanguage]
                }
              ></Button>
            </View>
          </View>
        </DismissKeyboard>
      </SafeArea>

      <AlertModal
        show={errorAddingWalletModal}
        headline={Texts.addWalletErrorHeadline[activeLanguage]}
        subHeadline={Texts.addWalletErrorText[activeLanguage]}
        confirmText={"OK"}
        onConfirm={() => {
          setErrorAddingWalletModal(false);
        }}
      ></AlertModal>

      <AlertModal
        show={existingWallet !== undefined}
        headline={Texts.walletExistsHeadline[activeLanguage].replace(
          "${name}",
          existingWallet?.name ?? ""
        )}
        subHeadline={Texts.walletExistsSubheadline[activeLanguage]}
        confirmText={Texts.add[activeLanguage]}
        cancelText={Texts.walletExistsActionCreateNew[activeLanguage]}
        onConfirm={() => {
          if (existingWallet) {
            setConnectedToId(existingWallet.id);
          }
          setExistingWallet(undefined);
        }}
        onCancel={() => {
          setExistingWallet(undefined);
        }}
      ></AlertModal>

      <AddCryptoModal
        data={SupportedWallets}
        show={showCryptoModal}
        onClose={() => {
          setShowCryptoModal(false);
        }}
        onSelect={async (selected: { name: string; currency: string }) => {
          setShowCryptoModal(false);
          const walletId = await getExistingWalletId(selected.name);

          if (walletId !== undefined) {
            setExistingWallet({
              name: selected.name,
              id: walletId,
            });
          }
          setName(selected.name);
          setCurrency(selected.currency);
        }}
      ></AddCryptoModal>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
  },
  page: {
    flex: 1,
    zIndex: 10,
  },
  cryptoInput: {
    color: Colors.white,
    borderColor: Colors.fadeLight,
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 50,
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
  },
  addWallet: {
    marginTop: 5,
  },
  qrCodeButtonWrapper: {
    position: "absolute",
    top: 2,
    right: 1,
    zIndex: 1,
  },
  qrCodeButton: {
    borderRadius: 0,
    padding: 11,
  },
});

export default AddWalletScreen;
