import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { LineChart } from "react-native-svg-charts";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { Colors } from "~/constants";
import { IMarketDataItem } from "~/models/market-data";

const MarketdataItem = (props) => {
  if (!props.route?.params?.item) {
    throw new Error("maket data item not provied");
  }
  const [name, setName] = useState("");
  const [chartData, setChartData] = useState<number[]>([]);
  const [trendColor, setTrendColor] = useState(Colors.green);

  useEffect(() => {
    const { name, data } = props.route.params.item as IMarketDataItem;
    const { lastDayHistory } = data;
    const m = lastDayHistory.map((h) => h.price);
    setName(name);
    setChartData(m);
    if (
      lastDayHistory[0].price > lastDayHistory[lastDayHistory.length - 1].price
    ) {
      setTrendColor(Colors.red);
    }
  }, []);

  return (
    <SafeArea>
      <SubPageHeader navigation={props.navigation}>{name}</SubPageHeader>
      <View style={styles.logoWrapper}>
        <Image style={styles.logo} source={props.route.params.iconPath}></Image>
      </View>
      <View style={styles.chartWrapper}>
        <LineChart
          style={styles.chart}
          data={chartData}
          svg={{ stroke: Colors.green }}
          contentInset={{ top: 0, bottom: 0, left: 0, right: 0 }}
        ></LineChart>
      </View>
    </SafeArea>
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
    height: 150,
  },
  chart: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default MarketdataItem;
