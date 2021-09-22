import { LinearGradient } from "expo-linear-gradient";
import React, { useContext, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "~/components/button";
import DismissKeyboard from "~/components/dismiss-keyboard";
import Modal from "~/components/modal";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { Colors, Fonts, PathNames } from "~/constants";
import { insertItemToLocalDB } from "~/db";
import { AppConfig } from "~/models/context";
import { CryptoIcon } from "~/models/crypto-icon";
import { fetchAddress } from "~/services/fetch-address";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  const appConfig = useContext(AppConfig);
  const [cryptoName, setCryptoName] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("");
  const [cryptoAddress, setEnteredCryptoAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fetchingAndSavingAddress, setFetchingAndSavingAddress] =
    useState(false);

  const addWallet = async () => {
    if (fetchingAndSavingAddress || !cryptoName || !cryptoAddress) {
      return;
    }
    let balance = 0;
    try {
      setFetchingAndSavingAddress(true);
      balance = await fetchAddress(cryptoAddress, cryptoCurrency, appConfig);
    } catch {
      setFetchingAndSavingAddress(false);
      return;
    }

    insertItemToLocalDB(cryptoName, cryptoCurrency, cryptoAddress, balance)
      .then(() => {
        props.navigation.navigate(PathNames.home, {
          updateWallet: true,
        });
      })
      .catch(() => {
        throw new Error("Inser Wallet into DB failed");
      })
      .finally(() => {
        setFetchingAndSavingAddress(false);
      });
  };

  return (
    <AppConfig.Consumer>
      {(config) => (
        <SafeArea>
          <DismissKeyboard>
            <View style={styles.page}>
              <SubPageHeader navigation={props.navigation}>
                Neues Wallet anlegen
              </SubPageHeader>

              <View style={styles.inner}>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(true);
                  }}
                >
                  <View style={styles.cryptoInput}>
                    <AppText>
                      {cryptoName ? cryptoName : "Name der Kryptowährung"}
                    </AppText>
                  </View>
                </TouchableOpacity>
                <TextInput
                  style={styles.cryptoInput}
                  placeholder="Adresse"
                  placeholderTextColor={Colors.white}
                  onChangeText={setEnteredCryptoAddress}
                ></TextInput>
                <Button
                  onPress={() => {
                    addWallet();
                  }}
                  style={styles.addWallet}
                  text={
                    fetchingAndSavingAddress ? "Lade Wallet" : "Wallet anlegen"
                  }
                ></Button>
              </View>
            </View>
          </DismissKeyboard>
          <Modal
            show={showModal}
            onClose={() => {
              setShowModal(false);
            }}
          >
            <FlatList
              contentContainerStyle={{ paddingBottom: 40 }}
              data={config.supported}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                const icon = new CryptoIcon(item.name);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCryptoName(item.name);
                      setCryptoCurrency(item.currency);
                      setShowModal(false);
                    }}
                  >
                    <View style={styles.addCryptoItemWrapper}>
                      <Image
                        style={styles.cryptoIcon}
                        source={icon.path}
                      ></Image>
                      <AppText style={styles.addCryptoModalText}>
                        {item.name}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
            <LinearGradient
              colors={[Colors.transparent, Colors.white]}
              style={styles.gradient}
            />
          </Modal>
        </SafeArea>
      )}
    </AppConfig.Consumer>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
  },
  page: {
    flex: 1,
  },
  addCryptoItemWrapper: {
    paddingVertical: 13,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  cryptoIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
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
  addCryptoModalText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
  gradient: {
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: -1,
    left: 0,
  },
  addWallet: {
    marginTop: 5,
  },
});

export default AddWalletScreen;
