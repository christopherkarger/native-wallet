import React, { useContext } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "~/components/modal";
import AppText from "~/components/text";
import { Colors, Fonts } from "~/constants";
import { AppConfigContext } from "~/models/context";
import { CryptoIcon } from "~/models/crypto-icon";
import { randomString } from "~/services/helper";

const AddCryptoModal = (props) => {
  const appConfig = useContext(AppConfigContext);
  return (
    <Modal
      show={props.show}
      onClose={() => {
        props.onClose();
      }}
    >
      <FlatList
        data={appConfig.supported}
        keyExtractor={(_, index) => randomString(index)}
        renderItem={({ item, index }) => {
          const icon = new CryptoIcon(item.name);
          return (
            <TouchableOpacity
              onPress={() => {
                props.onSelect({
                  name: item.name,
                  currency: item.currency,
                });
              }}
            >
              <View style={styles.addCryptoItemWrapper}>
                <Image style={styles.cryptoIcon} source={icon.path}></Image>
                <AppText style={styles.addCryptoModalText}>{item.name}</AppText>
              </View>
            </TouchableOpacity>
          );
        }}
      ></FlatList>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

  addCryptoModalText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
});

export default AddCryptoModal;
