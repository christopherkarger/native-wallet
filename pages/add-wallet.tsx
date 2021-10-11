import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AddCryptoModal from "~/components/add-crypto-modal";
import Button from "~/components/button";
import DismissKeyboard from "~/components/dismiss-keyboard";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { Colors, PathNames } from "~/constants";
import { insertItemToLocalDB } from "~/db";
import { AppConfig } from "~/models/context";
import { fetchAddress } from "~/services/fetch-address";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  const appConfig = useContext(AppConfig);
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
    try {
      setFetchingAndSavingAddress(true);
      balance = await fetchAddress(address, name, appConfig);
    } catch (err) {
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

    insertItemToLocalDB(
      name,
      currency,
      address,
      balance,
      new Date().getTime(),
      connectedToId
    )
      .then(() => {
        props.navigation.navigate(PathNames.home);
      })
      .catch((err) => {
        console.log(err);
        setFetchingAndSavingAddress(false);
        console.error("Insert Wallet into DB failed");
      });
  };

  return (
    <View style={styles.container}>
      <SafeArea>
        <DismissKeyboard>
          <View style={styles.page}>
            <SubPageHeader navigation={props.navigation}>
              Neues Wallet anlegen
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
                  <AppText>{name ? name : "Wähle eine Kryptowährung"}</AppText>
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
                  placeholder="Adresse"
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
                  fetchingAndSavingAddress ? "Lade Wallet" : "Wallet anlegen"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
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
    paddingHorizontal: 15,
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
