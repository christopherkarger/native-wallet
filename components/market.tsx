import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, View } from "react-native";
import { CryptoIcon } from "~/models/crypto-icon";
import { IMarketDataItem } from "~/services/fetch-marketdata";
import { formatNumber } from "~/services/helper";
import { Colors, Fonts } from "../constants";
import AppText from "./text";

interface IMarketData {
  name: string;
  data: IMarketDataItem;
}

const Market = (props) => {
  const [marketData, setMarketData] = useState<IMarketData[]>([]);

  useEffect(() => {
    setMarketData(
      Object.keys(props.data)
        .map((key) => {
          return {
            name: key,
            data: props.data[key],
          };
        })
        .sort((a, b) => {
          return a.data.rank - b.data.rank;
        })
    );
  }, [props.data]);
  return (
    <View style={styles.inner}>
      <AppText style={styles.marketHeadline}>Krypto Markt</AppText>

      <FlatList
        style={styles.flatList}
        data={marketData}
        scrollEnabled={true}
        keyExtractor={(_, index) => index.toString()}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index }) => {
          const icon = new CryptoIcon(item.name);
          return (
            <View
              style={[
                styles.itemWrapper,
                index === marketData.length - 1 ? styles.lastItemWrapper : {},
              ]}
            >
              <Image style={styles.yourCoinLogo} source={icon.path}></Image>

              <View>
                <AppText style={styles.yourCoin}>{item.name}</AppText>
                <AppText style={styles.yourCoinShort}>
                  {item.data.currency}
                </AppText>
              </View>
              {/* {Dimensions.get("window").width >= 400 && (
                <View style={styles.graph}>
                  <GraphLine
                    data={[10, 12, 14, 12, 13]}
                    width={200}
                    height={58}
                    lineColor={Colors.green}
                    strokeWidth={2}
                  ></GraphLine>
                </View>
              )} */}

              <View style={styles.priceWrapper}>
                <AppText style={styles.price}>
                  {formatNumber(item.data.price, undefined, true)} €
                </AppText>
              </View>
            </View>
          );
        }}
      ></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  inner: {
    flex: 1,
  },
  marketHeadline: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightWhite,
    paddingBottom: 12,
    marginLeft: 20,
    marginRight: 20,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightWhite,
    paddingBottom: 12,
  },
  lastItemWrapper: {
    borderBottomWidth: 0,
  },
  yourCoinLogo: {
    width: 36,
    height: 36,
  },
  yourCoin: {
    fontSize: 16,
    marginLeft: 12,
  },
  yourCoinShort: {
    fontSize: 14,
    marginLeft: 12,
    color: Colors.lightWhite,
  },
  priceWrapper: {
    marginLeft: "auto",
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: 20,
  },
  graph: {
    marginLeft: 23,
    transform: [{ translateY: 5 }],
  },
  flatList: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
export default Market;
