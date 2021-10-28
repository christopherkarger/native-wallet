import * as shape from "d3-shape";
import React, { useContext, useMemo } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-svg-charts";
import { DeviceLanguage } from "~/models/context";
import { CryptoIcon } from "~/models/crypto-icon";
import { MarketData } from "~/models/market-data";
import { formatNumber } from "~/services/format-number";
import { calcPercentage, formatDate, randomString } from "~/services/helper";
import { Texts } from "~/texts";
import { Colors, Fonts, PathNames } from "../constants";
import AppText from "./text";

const Market = (props) => {
  const marketData = props.data as MarketData;
  const deviceLanguage = useContext(DeviceLanguage);

  const renderedMarketItem = (listProps) => {
    const icon = new CryptoIcon(listProps.item.name);
    const chartData = listProps.item.data.lastDayHistory.map((h) => h.price);
    const positiveTrend = chartData[0] < chartData[chartData.length - 1];
    const trendColor = positiveTrend ? Colors.green : Colors.red;
    const percentage = calcPercentage(
      chartData[0],
      chartData[chartData.length - 1]
    );

    return (
      <View
        style={[
          styles.itemWrapper,
          marketData?.items && listProps.index === marketData.items.length - 1
            ? styles.lastItemWrapper
            : {},
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate(PathNames.marketDataItem, {
              item: listProps.item,
              name: listProps.item.name,
              iconPath: icon.path,
            });
          }}
          style={styles.itemTouchWrapper}
        >
          <View style={styles.coinWrapper}>
            <Image style={styles.coinLogo} source={icon.path}></Image>
            <View>
              <AppText style={styles.name}>{listProps.item.name}</AppText>
              <AppText style={styles.currency}>
                {listProps.item.data.currency}
              </AppText>
            </View>
          </View>
          {Dimensions.get("window").width >= 300 && (
            <View style={styles.chartWrapper}>
              <LineChart
                style={styles.chart}
                data={chartData}
                svg={{ stroke: trendColor }}
                curve={shape.curveNatural}
                contentInset={{ top: 5, bottom: 5, left: 0, right: 0 }}
              ></LineChart>
            </View>
          )}

          <View style={styles.priceWrapper}>
            <AppText style={styles.price}>
              {formatNumber({
                number: listProps.item.data.price,
                language: deviceLanguage,
              })}{" "}
              €
            </AppText>
            <AppText
              style={positiveTrend ? styles.positveTrend : styles.negativeTrend}
            >
              {percentage > 0 ? "+" : ""}
              {percentage.toFixed(2)}%
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const memoizedListItem = useMemo(() => renderedMarketItem, [props.data]);

  return (
    <View style={styles.inner}>
      <View style={styles.header}>
        <AppText style={styles.marketHeadline}>
          {Texts.marketHeadline[deviceLanguage]}
        </AppText>
        {marketData?.items[0]?.data.lastFetched && (
          <AppText style={styles.lastFetched}>
            {Texts.dataFrom[deviceLanguage]}:{" "}
            {formatDate(marketData.items[0].data.lastFetched)}
          </AppText>
        )}
      </View>
      <FlatList
        style={styles.flatList}
        data={marketData?.itemsByMarketCap}
        scrollEnabled={true}
        keyExtractor={(_, index) => randomString(index)}
        keyboardShouldPersistTaps="handled"
        renderItem={memoizedListItem}
      ></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightWhite,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  lastFetched: {
    fontSize: 12,
  },
  marketHeadline: {
    fontSize: 20,
    fontFamily: Fonts.bold,
  },
  itemTouchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 12,
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightWhite,
  },
  lastItemWrapper: {
    borderBottomWidth: 0,
  },
  coinWrapper: {
    flexDirection: "row",
    minWidth: 130,
  },
  coinLogo: {
    width: 36,
    height: 36,
  },
  name: {
    fontSize: 16,
    marginLeft: 12,
  },
  currency: {
    fontSize: 14,
    marginLeft: 12,
    color: Colors.lightWhite,
  },
  priceWrapper: {
    alignItems: "flex-end",

    minWidth: 110,
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: 17,
  },
  chartWrapper: {
    width: 60,
    height: 30,
  },
  chart: {
    width: "100%",
    height: "100%",
  },
  flatList: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  positveTrend: {
    color: Colors.green,
  },
  negativeTrend: {
    color: Colors.red,
  },
});
export default Market;
