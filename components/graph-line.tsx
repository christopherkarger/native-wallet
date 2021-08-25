import React from "react";
import { StyleSheet, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const GraphLine = (props) => {
  return (
    <View style={styles.chartWrapper}>
      <LineChart
        style={{ ...props.style, ...styles.chart }}
        data={{
          labels: [],
          datasets: [
            {
              data: props.data,
            },
          ],
        }}
        width={props.width}
        height={props.height}
        withVerticalLines={false}
        withHorizontalLines={false}
        withScrollableDot={false}
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLabels={false}
        withHorizontalLabels={false}
        withShadow={false}
        withDots={false}
        yAxisInterval={1}
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          decimalPlaces: 2,
          color: () => props.lineColor,
          strokeWidth: props.strokeWidth,
        }}
        bezier
      />
    </View>
  );
};
const styles = StyleSheet.create({
  chartWrapper: {
    overflow: "hidden",
  },
  chart: {
    position: "relative",
    left: "-38%",
    top: "-7%",
  },
});

export default GraphLine;
