import React, { useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, FlatList, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PieChart } from "react-native-svg-charts";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors, Fonts, PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { selectLocalDBTableWallets } from "~/db";
import { useIsMounted } from "~/hooks/mounted";
import { UPDATE_WALLETS_EVENT_TYPE } from "~/hooks/update-local-wallet-balances";
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
import { getWalletWrapper } from "~/services/getWalletWrapper";
import { randomString } from "~/services/helper";
import { Texts } from "~/texts";

const PortfolioOverview = (props) => {
  if (!props.route?.params) {
    throw new Error("wallet data not provided");
  }

  const [activeLanguage] = useContext(ActiveLanguageContext);
  const [activeCurrency] = useContext(ActiveCurrencyContext);
  const [chartData, setChartData] = useState<any[]>([]);
  const [listData, setListData] = useState<any[]>([]);
  const [allWalletWrapper, setAllWalletWrapper] = useState(
    props.route?.params as WalletWrapper[]
  );
  const euroPrice = useContext(EURPriceContext);
  const marketData: MarketData = useContext(MarketDataContext);
  const mounted = useIsMounted();

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      UPDATE_WALLETS_EVENT,
      async (event) => {
        if (event == UPDATE_WALLETS_EVENT_TYPE.Update) {
          const localWallets = await selectLocalDBTableWallets().catch(
            () => {}
          );
          if (localWallets && localWallets.rows.length && mounted.current) {
            setAllWalletWrapper(getWalletWrapper(localWallets.rows._array));
          }
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const portfolioBalance = calcTotalBalance(marketData, allWalletWrapper);
    const data: any[] = [];
    allWalletWrapper.forEach((w, i) => {
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

    if (mounted.current) {
      setListData(
        allWalletWrapper.sort(
          (a, b) =>
            calcTotalBalance(marketData, [b]) -
            calcTotalBalance(marketData, [a])
        )
      );

      setChartData(data);
    }
  }, [marketData, allWalletWrapper]);

  const RenderedListItem = (listProps) => {
    const walletWrapper = listProps.item as WalletWrapper;
    const itemBalance = calcTotalBalance(marketData, [walletWrapper]);
    const portfolioBalance = calcTotalBalance(marketData, allWalletWrapper);
    const percentage = (itemBalance / portfolioBalance) * 100;

    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate(
            walletWrapper.isCoinWallet
              ? PathNames.singleCoin
              : PathNames.singleWallet,
            {
              data: walletWrapper,
              index: listProps.index,
            }
          );
        }}
      >
        <View
          style={[
            styles.itemWrapper,
            listProps.index === listData.length - 1
              ? styles.lastItemWrapper
              : {},
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
              {percentage < 0.1
                ? "< 0.1"
                : formatNumber({
                    number: percentage,
                    language: activeLanguage,
                    decimal: "00",
                  })}
              %
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
      </TouchableOpacity>
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
          renderItem={(listProps) => RenderedListItem(listProps)}
          ListHeaderComponent={() => {
            return (
              <View style={styles.chartWrapper}>
                <AppText style={styles.totalBalance}>
                  {formatNumberWithCurrency({
                    number: calcTotalBalance(marketData, allWalletWrapper),
                    language: activeLanguage,
                    currency: activeCurrency,
                    euroPrice: euroPrice,
                  })}{" "}
                  {CurrencyIcon.icon(activeCurrency)}
                </AppText>
                <PieChart
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
    borderLeftWidth: 3,
    borderLeftColor: "black",
    paddingLeft: 10,
  },
  rightWrapper: {
    alignItems: "flex-end",
  },
});

export default PortfolioOverview;
