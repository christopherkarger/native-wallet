import React, { useState } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Modal from "~/components/modal";
import SafeArea from "~/components/safe-area";
import AppText from "~/components/text";
import { Colors } from "~/constants";
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
            <TouchableWithoutFeedback
              onPress={() => {
                console.log(config);
                setShowModal(true);
              }}
            >
              <View style={styles.cryptoName}>
                <AppText>Name der Kryptowährung</AppText>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <Modal
            show={showModal}
            onClose={() => {
              setShowModal(false);
            }}
          >
            <AppText style={styles.addCryptoModal}>Hallo</AppText>
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
  addCryptoModal: {
    color: "black",
  },
});

export default AddWalletScreen;
