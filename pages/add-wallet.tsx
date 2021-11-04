import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AddCryptoModal from "~/components/add-crypto-modal";
import Button from "~/components/button";
import DismissKeyboard from "~/components/dismiss-keyboard";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { Colors, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { insertItemToLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { ActiveLanguageContext, AppConfigContext } from "~/models/context";
import { fetchAddress } from "~/services/fetch-address";
import { Texts } from "~/texts";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const mounted = useIsMounted();
  const appConfig = useContext(AppConfigContext);
  const [nameChangeAllowed, setNameChangeAllowed] = useState(true);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [address, setEnteredAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fetchingAndSavingAddress, setFetchingAndSavingAddress] =
    useState(false);
  const [connectedToId, setConnectedToId] = useState<number>();

  useEffect(() => {
    if (props.route.params && props.route.params.address) {
      setEnteredAddress(props.route.params.address);
    }
  }, [props.route.params]);

  useEffect(() => {
    if (props.route.params && props.route.params.addToWallet) {
      setConnectedToId(props.route.params.id);
      setName(props.route.params.name);
      setCurrency(props.route.params.currency);
      setNameChangeAllowed(false);
    }
  }, []);

  const addWallet = async () => {
    if (fetchingAndSavingAddress || !name || !address) {
      return;
    }
    let balance = 0;
    let transactions = [];
    try {
      setFetchingAndSavingAddress(true);
      const fetchedAddress = await fetchAddress(
        address.trim(),
        name.trim(),
        appConfig
      );
      balance = fetchedAddress.balance;
      transactions = fetchedAddress.transactions;
    } catch (err) {
      console.error(err);
      setFetchingAndSavingAddress(false);
      Alert.alert(
        "Wallet konnte nicht angelegt werden!",
        "Korregiere die Adresse oder versuche es bitte erneut.",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
      return;
    }

    if (mounted.current) {
      insertItemToLocalDBTableWallets(
        name.trim(),
        currency,
        address.trim(),
        balance,
        new Date().getTime(),
        transactions,
        connectedToId
      )
        .then(() => {
          DeviceEventEmitter.emit(UPDATE_WALLETS_EVENT, true);
          props.navigation.navigate(PathNames.home);
        })
        .catch((err) => {
          setFetchingAndSavingAddress(false);
          console.error("Insert Wallet into DB failed");
          console.error(err);
        });
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
                    setShowModal(true);
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
                ></TextInput>
              </View>

              <Button
                onPress={() => {
                  addWallet();
                }}
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
        <AddCryptoModal
          show={showModal}
          onOutsideClick={() => {
            setShowModal(false);
          }}
          onSelect={(selected: { name: string; currency: string }) => {
            setName(selected.name);
            setCurrency(selected.currency);
            setShowModal(false);
          }}
        ></AddCryptoModal>
      </SafeArea>
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
  },
  addWallet: {
    marginTop: 5,
  },
  qrCodeButtonWrapper: {
    position: "absolute",
    top: 5,
    right: 0,
    zIndex: 1,
  },
  qrCodeButton: {
    borderRadius: 0,
    padding: 10,
  },
});

export default AddWalletScreen;
