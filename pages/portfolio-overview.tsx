import React, { useContext, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-svg-charts";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors, Fonts } from "~/constants";
import {
  ActiveCurrencyContext,
  ActiveLanguageContext,
  EURPriceContext,
  MarketDataContext,
} from "~/models/context";
import { CurrencyIcon } from "~/models/currency-icon";
import { MarketData } from "~/models/market-data";
import { WalletWrapper } from "~/models/wallet-wrapper";
import { calcTotalBalance } from "~/services/calc-balance";
import {
  formatNumber,
  formatNumberWithCurrency,
} from "~/services/format-number";
import { randomString } from "~/services/helper";
import { Texts } from "~/texts";

const PortfolioOverview = (props) => {
  const euroPrice = useContext(EURPriceContext);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const [chartData, setChartData] = useState<any[]>([]);
  const [listData, setListData] = useState<any[]>([]);
  const marketData: MarketData = useContext(MarketDataContext);

  useEffect(() => {
    if (!props.route?.params) {
      throw new Error("wallet data not provided");
    }
    const walletWrapper = props.route?.params as WalletWrapper[];
    const portfolioBalance = calcTotalBalance(marketData, walletWrapper);

    setListData(
      walletWrapper.sort(
        (a, b) =>
          calcTotalBalance(marketData, [b]) - calcTotalBalance(marketData, [a])
      )
    );

    const data: any[] = [];
    walletWrapper.map((w, i) => {
      const itemBalance = calcTotalBalance(marketData, [w]);
      const percentage = (itemBalance / portfolioBalance) * 100;

      if (percentage > 1) {
        data.push({
          value: percentage,
          svg: {
            fill: w.mainColor,
            onPress: () => {},
          },
          key: `pie-${i}`,
        });
      }
    });

    setChartData(data);
  }, []);

  const renderedListItem = (listProps) => {
    const allWalletWrapper = props.route?.params as WalletWrapper[];
    const walletWrapper = listProps.item as WalletWrapper;
    const itemBalance = calcTotalBalance(marketData, [walletWrapper]);
    const portfolioBalance = calcTotalBalance(marketData, allWalletWrapper);
    const percentage = (itemBalance / portfolioBalance) * 100;

    return (
      <View
        style={[
          styles.itemWrapper,
          listProps.index === listData.length - 1 ? styles.lastItemWrapper : {},
        ]}
      >
        <View
          style={[
            styles.leftWrapper,
            { borderLeftColor: walletWrapper.mainColor },
          ]}
        >
          <View style={styles.currencyWrapper}>
            <AppText style={styles.amount}>
              {formatNumber({
                number: walletWrapper.totalBalance,
                language: activeLanguage,
              })}
            </AppText>
            <AppText style={styles.grey}>
              {walletWrapper.wallets[0].currency}
            </AppText>
          </View>
          <AppText>{walletWrapper.wallets[0].name}</AppText>
        </View>
        <View style={styles.rightWrapper}>
          <AppText>
            {percentage < 0.1 ? "< 0.1" : percentage.toFixed(2)}%
          </AppText>
          <AppText style={styles.grey}>
            {formatNumberWithCurrency({
              number: calcTotalBalance(marketData, [walletWrapper]),
              language: activeLanguage,
              currency: activeCurrency,
              euroPrice: euroPrice,
            })}{" "}
            {CurrencyIcon.icon(activeCurrency)}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {Texts.yourPortfolio[activeLanguage]}
        </SubPageHeader>
        <FlatList
          data={listData}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 20,
            paddingLeft: 20,
          }}
          keyExtractor={(_, index) => randomString(index)}
          renderItem={useMemo(() => renderedListItem, [props.data])}
          ListHeaderComponent={() => {
            return (
              <View style={styles.chartWrapper}>
                <AppText style={styles.totalBalance}>
                  {formatNumberWithCurrency({
                    number: calcTotalBalance(marketData, props.route?.params),
                    language: activeLanguage,
                    currency: activeCurrency,
                    euroPrice: euroPrice,
                  })}{" "}
                  {CurrencyIcon.icon(activeCurrency)}
                </AppText>
                <PieChart
                  animate={true}
                  padAngle={0}
                  innerRadius={"40%"}
                  style={{ height: 200 }}
                  data={chartData}
                />
              </View>
            );
          }}
        ></FlatList>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  totalBalance: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 27,
    fontFamily: Fonts.bold,
  },
  chartWrapper: {
    marginBottom: 20,
  },
  itemWrapper: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightWhite,
    justifyContent: "space-between",
  },
  lastItemWrapper: {
    borderBottomWidth: 0,
  },
  currencyWrapper: {
    flexDirection: "row",
  },
  grey: {
    color: Colors.grey,
  },
  amount: {
    marginRight: 4,
  },
  leftWrapper: {
    borderLeftWidth: 2,
    borderLeftColor: "black",
    paddingLeft: 10,
  },
  rightWrapper: {
    alignItems: "flex-end",
  },
});

export default PortfolioOverview;
