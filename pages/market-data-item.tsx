import * as shape from "d3-shape";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LineChart } from "react-native-svg-charts";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors, Fonts } from "~/constants";
import { IMarketDataItem, IMarketDataItemData } from "~/models/market-data";
import { formatNumber } from "~/services/format-number";
import { calcPercentage } from "~/services/helper";

enum ChartView {
  hours,
  month,
  week,
}

const MarketdataItem = (props) => {
  if (!props.route?.params?.item) {
    throw new Error("maket data item not provied");
  }
  const [name, setName] = useState("");
  const [chartData, setChartData] = useState<number[]>([]);
  const [trendColor, setTrendColor] = useState(Colors.green);
  const [marketData, setMarketData] = useState<IMarketDataItemData>();
  const [chartView, setChartView] = useState<ChartView>();
  const [percentage, setPercentage] = useState(0);
  const [price, setPrice] = useState(0);

  const changeView = (view: ChartView): void => {
    if (!marketData) {
      return;
    }
    const viewData =
      view === ChartView.hours ? marketData.lastDayHistory : marketData.history;
    let m = viewData.map((h) => h.price);

    if (view === ChartView.week) {
      m = m.slice(-7);
    }

    setChartData(m);
    setChartView(view);
    if (viewData[0].price > viewData[viewData.length - 1].price) {
      setTrendColor(Colors.red);
    }
  };

  useEffect(() => {
    const { name, data } = props.route.params.item as IMarketDataItem;
    setName(name);
    setMarketData(data);
  }, []);

  useEffect(() => {
    setPercentage(
      calcPercentage(chartData[0], chartData[chartData.length - 1])
    );
  }, [chartData]);

  useEffect(() => {
    changeView(ChartView.week);
    if (marketData) {
      setPrice(marketData.price);
    }
  }, [marketData]);

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>{name}</SubPageHeader>
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
            style={[
              styles.chartButton,
              chartView === ChartView.hours ? styles.activeChartButton : {},
            ]}
            onPress={() => changeView(ChartView.hours)}
          >
            <AppText>24 Std.</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chartButton,
              chartView === ChartView.week ? styles.activeChartButton : {},
            ]}
            onPress={() => changeView(ChartView.week)}
          >
            <AppText>7 Tage</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chartButton,
              chartView === ChartView.month ? styles.activeChartButton : {},
            ]}
            onPress={() => changeView(ChartView.month)}
          >
            <AppText>30 Tage</AppText>
          </TouchableOpacity>
        </View>
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
});

export default MarketdataItem;
