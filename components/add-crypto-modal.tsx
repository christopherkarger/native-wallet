import { LinearGradient } from "expo-linear-gradient";
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
import { AppConfig } from "~/models/context";
import { CryptoIcon } from "~/models/crypto-icon";

const AddCryptoModal = (props) => {
  const appConfig = useContext(AppConfig);
  return (
    <Modal
      show={props.show}
      onOutsideClick={() => {
        props.onOutsideClick();
      }}
    >
      <FlatList
        contentContainerStyle={{ paddingBottom: 30 }}
        data={appConfig.supported}
        keyExtractor={(_, index) => index.toString()}
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
      <LinearGradient
        pointerEvents="none"
        colors={[Colors.transparent, Colors.white]}
        style={styles.gradient}
      />
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
  gradient: {
    width: "100%",
    height: 100,
    position: "absolute",
    bottom: -1,
    left: 0,
  },
});

export default AddCryptoModal;
