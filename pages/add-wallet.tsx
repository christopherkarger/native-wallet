import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import Modal from "~/components/modal";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { Colors, Fonts } from "~/constants";
import { AppConfig } from "~/models/context";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  const [cryptoName, setCryptoName] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <AppConfig.Consumer>
      {(config) => (
        <SafeArea>
          <SubPageHeader navigation={props.navigation}>
            Neues Wallet anlegen
          </SubPageHeader>

          <View style={styles.inner}>
            <TouchableOpacity
              onPress={() => {
                setShowModal(true);
              }}
            >
              <View style={styles.cryptoName}>
                <AppText>
                  {cryptoName ? cryptoName : "Name der Kryptowährung"}
                </AppText>
              </View>
            </TouchableOpacity>
          </View>

          <Modal
            show={showModal}
            onClose={() => {
              setShowModal(false);
            }}
          >
            <FlatList
              data={config.supported}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCryptoName(item.name);
                      setShowModal(false);
                    }}
                    style={styles.addCryptoItemWrapper}
                  >
                    <AppText style={styles.addCryptoModalText}>
                      {item.name}
                    </AppText>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
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
  cryptoName: {
    borderColor: Colors.fadeLight,
    borderRadius: 5,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  addCryptoItemWrapper: {
    paddingVertical: 13,
    paddingHorizontal: 8,
  },
  addCryptoModalText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
});

export default AddWalletScreen;
