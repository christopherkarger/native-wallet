import React, { useContext, useEffect, useMemo, useState } from "react";
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

interface IModalData {
  name: string;
  currency: string;
  info?: string;
}

const AddCryptoModal = (props) => {
  const marketData: MarketData = useContext(MarketDataContext);
  const [modalData, setModalData] = useState<IModalData[]>();

  useEffect(() => {
    const modalData = props.data as IModalData[];
    const market = marketData.itemsByMarketCap.map((m) => ({
      currency: m.data.currency,
      rank: m.data.rank,
    }));

    setModalData(
      modalData.sort((a, b) => {
        return (
          market.findIndex((m) => m.currency === a.currency) -
          market.findIndex((m) => m.currency === b.currency)
        );
      })
    );
  }, [props.data]);

  const renderedListItem = (listProps) => {
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
            {listProps.item.info ? `(${listProps.item.info})` : ""}
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
