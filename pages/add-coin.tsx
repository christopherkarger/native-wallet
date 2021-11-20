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
import Button from "~/components/button";
import DismissKeyboard from "~/components/dismiss-keyboard";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { Colors, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { insertItemToLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { UPDATE_WALLETS_EVENT_TYPE } from "~/hooks/update-local-wallet-balances";
import {
  ActiveLanguageContext,
  MarketDataContext,
  SupportedLanguages,
} from "~/models/context";
import { MarketData } from "~/models/market-data";
import { Texts } from "~/texts";
import SubPageHeader from "../components/sub-page-header";

const AddCoinScreen = (props) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const mounted = useIsMounted();
  const [nameChangeAllowed, setNameChangeAllowed] = useState(true);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [connectedToId, setConnectedToId] = useState<number>();
  const marketData: MarketData = useContext(MarketDataContext);

  useEffect(() => {
    if (props.route.params && props.route.params.isAddingTo) {
      setConnectedToId(props.route.params.id);
      setName(props.route.params.name);
      setCurrency(props.route.params.currency);
      setNameChangeAllowed(false);
    }
  }, []);

  const addCoin = async () => {
    Keyboard.dismiss();

    if (!name || !balance) {
      return;
    }

    let balanceInput = balance.trim();

    if (activeLanguage === SupportedLanguages.DE) {
      balanceInput.replace(",", ".");
    }
    if (isNaN(+balanceInput)) {
      // Alert not a number
      return;
    }

    if (mounted.current) {
      const marketItem = marketData.findItemByName(name);
      try {
        await insertItemToLocalDBTableWallets({
          name: name,
          currency: currency,
          balance: +balanceInput,
          isCoinWallet: true,
          isDemoAddress: false,
          addedAt: new Date().getTime(),
          coinPrice: marketItem ? marketItem.data.price : undefined,
          connectedToId: connectedToId,
        });
        DeviceEventEmitter.emit(
          UPDATE_WALLETS_EVENT,
          UPDATE_WALLETS_EVENT_TYPE.Add
        );
        if (connectedToId !== undefined) {
          props.navigation.goBack();
        } else {
          props.navigation.navigate(PathNames.home);
        }
      } catch (err) {
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
              {Texts.addNewCoin[activeLanguage]}
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
                <TextInput
                  style={styles.cryptoInput}
                  placeholder={Texts.balance[activeLanguage]}
                  placeholderTextColor={Colors.white}
                  onChangeText={setBalance}
                  value={balance}
                  keyboardType="numeric"
                ></TextInput>
              </View>

              <Button
                onPress={() => addCoin()}
                style={styles.addCoin}
                disabled={!name || !balance}
                text={Texts.addCoin[activeLanguage]}
              ></Button>
            </View>
          </View>
        </DismissKeyboard>
      </SafeArea>
      <AddCryptoModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onSelect={(selected: { name: string; currency: string }) => {
          setName(selected.name);
          setCurrency(selected.currency);
          setShowModal(false);
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
  },
  addCoin: {
    marginTop: 5,
  },
});

export default AddCoinScreen;
