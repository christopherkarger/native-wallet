import * as shape from "d3-shape";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LineChart } from "react-native-svg-charts";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors } from "~/constants";
import { IMarketDataItem, IMarketDataItemData } from "~/models/market-data";

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

  const changeView = (view: ChartView, data: IMarketDataItemData): void => {
    const viewData =
      view === ChartView.hours ? data.lastDayHistory : data.history;
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
    setMarketData(data);
    setName(name);
    changeView(ChartView.week, data);
  }, []);

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>{name}</SubPageHeader>
        <View style={styles.logoWrapper}>
          <Image
            style={styles.logo}
            source={props.route.params.iconPath}
          ></Image>
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
            onPress={() => {
              if (marketData) {
                changeView(ChartView.hours, marketData);
              }
            }}
          >
            <AppText>24 Std.</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chartButton,
              chartView === ChartView.week ? styles.activeChartButton : {},
            ]}
            onPress={() => {
              if (marketData) {
                changeView(ChartView.week, marketData);
              }
            }}
          >
            <AppText>7 Tage</AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.chartButton,
              chartView === ChartView.month ? styles.activeChartButton : {},
            ]}
            onPress={() => {
              if (marketData) {
                changeView(ChartView.month, marketData);
              }
            }}
          >
            <AppText>30 Tage</AppText>
          </TouchableOpacity>
        </View>
      </SafeArea>
    </GradientView>
  );
};
const styles = StyleSheet.create({
  logoWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 70,
    height: 70,
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
});

export default MarketdataItem;
