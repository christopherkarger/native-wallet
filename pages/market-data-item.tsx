import * as shape from "d3-shape";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { LineChart } from "react-native-svg-charts";
import { DateTime } from "~/components/date-time";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors, Fonts } from "~/constants";
import { useIsMounted } from "~/hooks/mounted";
import { MarketDataContext } from "~/models/context";
import {
  IHistoryItem,
  IMarketDataItemData,
  MarketData,
} from "~/models/market-data";
import { formatNumber } from "~/services/format-number";
import { calcPercentage, randomString } from "~/services/helper";

enum ChartView {
  hours,
  month,
  week,
}

const MarketdataItem = (props) => {
  if (!props.route?.params?.item) {
    throw new Error("maket data item not provied");
  }
  const marketData: MarketData = useContext(MarketDataContext);
  const [chartData, setChartData] = useState<number[]>([]);
  const [listData, setListData] = useState<IHistoryItem[]>([]);
  const [trendColor, setTrendColor] = useState(Colors.green);
  const [coinMarketData, setcoinMarketData] = useState<IMarketDataItemData>();
  const [chartView, setChartView] = useState<ChartView>();
  const [percentage, setPercentage] = useState(0);
  const [price, setPrice] = useState(0);
  const mounted = useIsMounted();

  const changeView = (view: ChartView, data: IMarketDataItemData): void => {
    let viewData =
      view === ChartView.hours ? data.lastDayHistory : data.history;

    const cloneViewData = (d: IHistoryItem[]) =>
      d.map((c) => ({
        date: c.date,
        price: c.price,
      }));

    if (view === ChartView.week) {
      viewData = cloneViewData(viewData).slice(-7);
    }

    setChartData(cloneViewData(viewData).map((h) => h.price));
    setListData(cloneViewData(viewData).reverse());
    setTrendColor(
      viewData[0].price < viewData[viewData.length - 1].price
        ? Colors.green
        : Colors.red
    );
    setChartView(view);

    if (viewData.length > 0) {
      setPercentage(
        calcPercentage(viewData[0].price, viewData[viewData.length - 1].price)
      );
    }
  };

  useEffect(() => {
    const coin = marketData.findItemByName(props.route.params.name);
    if (coin && mounted.current) {
      setcoinMarketData(coin.data);
      setPrice(coin.data.price);
      changeView(chartView ?? ChartView.week, coin.data);
    }
  }, [marketData]);

  const renderItem = (listProps) => {
    return (
      <View style={styles.chartDataListItem}>
        <DateTime
          date={listProps.item.date}
          hourView={chartView === ChartView.hours}
        ></DateTime>
        <AppText>
          {formatNumber({
            number: listProps.item.price,
            beautifulDecimal: true,
          })}
          {" €"}
        </AppText>
      </View>
    );
  };

  const memoizedListItem = useMemo(() => renderItem, [chartView]);

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {props.route.params.name}
        </SubPageHeader>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={props.route.params.iconPath}
          ></Image>
          <View style={styles.headerPriceWrapper}>
            <AppText style={styles.headerPrice}>
              {formatNumber({
                number: price,
                beautifulDecimal: true,
              })}
              {" €"}
            </AppText>
            <AppText
              style={[
                styles.headerPercentage,
                percentage > 0 ? styles.positveTrend : styles.negativeTrend,
              ]}
            >
              {percentage > 0 ? "+" : ""}
              {percentage.toFixed(2)}%
            </AppText>
          </View>
        </View>
        <View style={styles.chartWrapper}>
          <LineChart
            style={styles.chart}
            data={chartData}
            svg={{ stroke: trendColor }}
            curve={shape.curveNatural}
            contentInset={{ top: 20, bottom: 20, left: 0, right: 0 }}
            animate={true}
          ></LineChart>
        </View>
        <View style={styles.chartButtonWraper}>
          <TouchableOpacity
            disabled={chartView === ChartView.hours}
            style={[
              styles.chartButton,
              chartView === ChartView.hours ? styles.activeChartButton : {},
            ]}
            onPress={() => {
              if (coinMarketData) {
                changeView(ChartView.hours, coinMarketData);
              }
            }}
          >
            <AppText>24 Std.</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={chartView === ChartView.week}
            style={[
              styles.chartButton,
              chartView === ChartView.week ? styles.activeChartButton : {},
            ]}
            onPress={() => {
              if (coinMarketData) {
                changeView(ChartView.week, coinMarketData);
              }
            }}
          >
            <AppText>7 Tage</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={chartView === ChartView.month}
            style={[
              styles.chartButton,
              chartView === ChartView.month ? styles.activeChartButton : {},
            ]}
            onPress={() => {
              if (coinMarketData) {
                changeView(ChartView.month, coinMarketData);
              }
            }}
          >
            <AppText>30 Tage</AppText>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.chartDataList}
          contentContainerStyle={{ paddingRight: 20, paddingLeft: 20 }}
          keyboardShouldPersistTaps="handled"
          data={listData}
          keyExtractor={(_, index) => randomString(index)}
          renderItem={memoizedListItem}
        ></FlatList>
      </SafeArea>
    </GradientView>
  );
};
const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
    flexDirection: "row",
  },
  headerPriceWrapper: {
    justifyContent: "center",
  },
  headerPrice: {
    fontFamily: Fonts.bold,
    fontSize: 25,
  },
  headerPercentage: {},
  logo: {
    width: 70,
    height: 70,
    marginRight: 20,
    marginLeft: 20,
  },
  chartWrapper: {
    width: Dimensions.get("window").width,
    height: 190,
  },
  chart: {
    width: "100%",
    height: "100%",
  },
  chartButtonWraper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    marginBottom: 20,
  },
  chartButton: {
    marginHorizontal: 15,
    padding: 15,
  },
  activeChartButton: {
    borderBottomWidth: 1,
    borderColor: Colors.white,
  },
  positveTrend: {
    color: Colors.green,
  },
  negativeTrend: {
    color: Colors.red,
  },
  chartDataList: {},
  chartDataListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: Colors.lightWhite,
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default MarketdataItem;
