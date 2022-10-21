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
import { SupportedCoins } from "~/config";
import { Colors, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { getExistingWalletId, insertItemToLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { UPDATE_WALLETS_EVENT_TYPE } from "~/hooks/update-local-wallet-balances";
import {
  ActiveLanguageContext,
  MarketDataContext,
  SupportedLanguages,
} from "~/models/context";
import { MarketData } from "~/models/market-data";
import { waitTime } from "~/services/helper";
import { Texts } from "~/texts";
import SubPageHeader from "../components/sub-page-header";

const AddCoinScreen = (props: {
  route: {
    params: {
      isAddingTo: boolean;
      id: React.SetStateAction<number | undefined>;
      name: React.SetStateAction<string>;
      currency: React.SetStateAction<string>;
    };
  };
  navigation: { navigate: (arg0: string) => void; goBack: () => void };
}) => {
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const mounted = useIsMounted();
  const [nameChangeAllowed, setNameChangeAllowed] = useState(true);
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [balance, setBalance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [connectedToId, setConnectedToId] = useState<number>();
  const marketData: MarketData = useContext(MarketDataContext);
  const [showIsNotANumberAlert, setShowIsNotANumberAlert] = useState(false);
  const [existingWallet, setExistingWallet] = useState<{
    name: string;
    id: number;
  }>();

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
      balanceInput = balanceInput.replace(",", ".");
    }

    if (isNaN(+balanceInput)) {
      setShowIsNotANumberAlert(true);
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

        // Wait till homescreen updates the wallets to avoid wallets flash
        await waitTime(100);

        if (nameChangeAllowed) {
          props.navigation.navigate(PathNames.home);
        } else {
          props.navigation.goBack();
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
              <View style={styles.coinInputWrapper}>
                <TextInput
                  style={styles.cryptoInput}
                  placeholder={"0"}
                  placeholderTextColor={Colors.white}
                  onChangeText={setBalance}
                  value={balance}
                  keyboardType="numeric"
                ></TextInput>

                {!!currency && (
                  <AppText style={styles.inputCurrency}>{currency}</AppText>
                )}
              </View>

              <Button
                onPress={() => addCoin()}
                style={styles.addCoin}
                disabled={!name || !balance}
                text={Texts.addWallet[activeLanguage]}
              ></Button>
            </View>
          </View>
        </DismissKeyboard>
      </SafeArea>
      <AddCryptoModal
        data={SupportedCoins}
        show={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onSelect={async (selected: { name: string; currency: string }) => {
          setShowModal(false);
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

      <AlertModal
        show={existingWallet !== undefined}
        headline={Texts.walletExistsHeadline[activeLanguage].replace(
          "{{name}}",
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

      <AlertModal
        show={showIsNotANumberAlert}
        headline={Texts.enterNumber[activeLanguage]}
        confirmText={"OK"}
        onConfirm={() => {
          setShowIsNotANumberAlert(false);
        }}
        onCancel={() => {
          setShowIsNotANumberAlert(false);
        }}
      ></AlertModal>
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
    paddingRight: 60,
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
  },
  addCoin: {
    marginTop: 5,
  },
  coinInputWrapper: {
    position: "relative",
  },
  inputCurrency: {
    position: "absolute",
    right: 15,
    top: 16,
  },
});

export default AddCoinScreen;
