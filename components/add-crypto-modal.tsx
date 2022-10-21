import React, { useContext, useMemo } from "react";
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
import { MarketDataContext } from "~/models/context";
import { CryptoIcon } from "~/models/crypto-icon";
import { MarketData } from "~/models/market-data";
import { randomString } from "~/services/helper";

export interface IModalData {
  name: string;
  currency: string;
  info?: string;
}

const AddCryptoModal = (props: {
  data: IModalData[];
  onSelect: (selected: { name: string; currency: string }) => void;
  show: boolean;
  onClose: () => void;
  showCryptoInfo?: boolean;
}) => {
  const marketData: MarketData = useContext(MarketDataContext);
  const modalData = useMemo(() => {
    return props.data.sort((a, b) => {
      return (
        market.findIndex((m) => m.currency === a.currency) -
        market.findIndex((m) => m.currency === b.currency)
      );
    });
  }, []);
  const market = marketData.itemsByMarketCap.map((m) => ({
    currency: m.data.currency,
    rank: m.data.rank,
  }));

  const renderedListItem = (listProps: { item: IModalData }) => {
    const icon = new CryptoIcon(listProps.item.name);
    return (
      <TouchableOpacity
        onPress={() => {
          props.onSelect({
            name: listProps.item.name,
            currency: listProps.item.currency,
          });
        }}
      >
        <View style={styles.addCryptoItemWrapper}>
          <Image style={styles.cryptoIcon} source={icon.path}></Image>
          <AppText style={styles.addCryptoModalText}>
            {listProps.item.name}{" "}
            {props.showCryptoInfo && listProps.item.info
              ? `(${listProps.item.info})`
              : ""}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      style={styles.modalWrapper}
      show={props.show}
      onClose={() => {
        props.onClose();
      }}
    >
      <FlatList
        data={modalData}
        keyExtractor={(_, index) => randomString(index)}
        renderItem={useMemo(() => renderedListItem, [])}
      ></FlatList>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    width: "80%",
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

  addCryptoModalText: {
    color: Colors.text,
    fontFamily: Fonts.bold,
  },
});

export default AddCryptoModal;
