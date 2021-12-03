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
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  EURPriceContext,
} from "~/models/context";
import { CryptoIcon } from "~/models/crypto-icon";
import { CurrencyIcon } from "~/models/currency-icon";
import { MarketData } from "~/models/market-data";
import {
  formatNumber,
  formatNumberWithCurrency,
} from "~/services/format-number";
import { calcPercentage, randomString } from "~/services/helper";
import { Texts } from "~/texts";
import { Colors, Fonts, PathNames } from "../constants";
import { DateTime } from "./date-time";
import AppText from "./text";

const Market = (props) => {
  const marketData = props.data as MarketData;
  const euroPrice = useContext(EURPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);

  const renderedListItem = (listProps) => {
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
          marketData?.items &&
          listProps.index === marketData.itemsByMarketCap.length - 1
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
          {Dimensions.get("window").width >= 350 && (
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
              {formatNumberWithCurrency({
                number: listProps.item.data.price,
                language: activeLanguage,
                currency: activeCurrency,
                euroPrice: euroPrice,
              })}{" "}
              {CurrencyIcon.icon(activeCurrency)}
            </AppText>
            <AppText
              style={positiveTrend ? styles.positveTrend : styles.negativeTrend}
            >
              {percentage > 0 ? "+" : ""}
              {formatNumber({
                number: percentage,
                language: activeLanguage,
                decimal: "00",
              })}
              %
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      style={styles.flatList}
      data={marketData.itemsByMarketCap}
      scrollEnabled={true}
      keyExtractor={(_, index) => randomString(index)}
      keyboardShouldPersistTaps="handled"
      renderItem={useMemo(
        () => renderedListItem,
        [marketData, activeLanguage, activeCurrency]
      )}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <>
          {props.ListHeaderComponent}
          {Object.keys(marketData).length > 0 && (
            <View style={styles.header}>
              <AppText style={styles.marketHeadline}>
                {Texts.marketHeadline[activeLanguage]}
              </AppText>
              {marketData?.items[0]?.data.lastFetched && (
                <DateTime
                  style={styles.lastFetched}
                  date={marketData.items[0].data.lastFetched}
                  withTime={true}
                ></DateTime>
              )}
            </View>
          )}
        </>
      }
    ></FlatList>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightWhite,
    paddingBottom: 10,
    marginHorizontal: 20,
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
    marginHorizontal: 20,
  },
  lastItemWrapper: {
    borderBottomWidth: 0,
  },
  coinWrapper: {
    flexDirection: "row",
    minWidth: 130,
  },
  coinLogo: {
    width: 34,
    height: 34,
  },
  name: {
    fontSize: 15,
    marginLeft: 10,
  },
  currency: {
    fontSize: 14,
    marginLeft: 10,
    color: Colors.grey,
  },
  priceWrapper: {
    alignItems: "flex-end",
    minWidth: 100,
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: 17,
  },
  chartWrapper: {
    width: 55,
    height: 30,
  },
  chart: {
    width: "100%",
    height: "100%",
  },
  flatList: {
    flex: 1,
  },
  positveTrend: {
    color: Colors.green,
  },
  negativeTrend: {
    color: Colors.red,
  },
});
export default Market;
