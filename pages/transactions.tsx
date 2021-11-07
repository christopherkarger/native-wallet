import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { DateTime } from "~/components/date-time";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors, Fonts } from "~/constants";
import { ActiveLanguageContext } from "~/models/context";
import { formatNumber } from "~/services/format-number";
import { Texts } from "~/texts";

const Transactions = (props) => {
  if (!props.route?.params?.transactions) {
    throw new Error("transactions not provied");
  }
  const [transactions] = useState(props.route.params.transactions);
  const [currency] = useState(props.route.params.currency);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {Texts.transactions[activeLanguage]}
        </SubPageHeader>
        <View style={styles.inner}>
          <View style={styles.transactionsHeader}>
            <AppText style={styles.currency}>{currency}</AppText>
          </View>
        </View>
        <FlatList
          style={styles.transactionsList}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          data={transactions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            const positiveChange = +item.balance_change > 0;
            return (
              <View
                style={[
                  styles.transactionItem,
                  index === 0 ? styles.noBorder : {},
                ]}
              >
                <MaterialIcons
                  name={
                    positiveChange ? "arrow-circle-down" : "arrow-circle-up"
                  }
                  size={30}
                  color={positiveChange ? Colors.lightBlue : Colors.purple}
                />
                <View style={styles.itemInfoWrapper}>
                  <DateTime style={styles.itemDate} date={item.time}></DateTime>
                  <AppText style={styles.itemHash}>
                    {Texts.hash[activeLanguage]}:
                  </AppText>
                  <AppText style={styles.itemHash}>{item.hash}</AppText>
                </View>

                <AppText
                  style={[
                    styles.amount,
                    positiveChange ? styles.amountPos : styles.amountNeg,
                  ]}
                >
                  {formatNumber({
                    number: item.balance_change,
                    decimal: "000000",
                    language: activeLanguage,
                  })}
                </AppText>
              </View>
            );
          }}
        ></FlatList>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    paddingHorizontal: 20,
  },
  transactionsHeader: {
    flexDirection: "row",
    borderBottomColor: Colors.lightWhite,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  currency: {
    marginLeft: "auto",
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopColor: Colors.lightWhite,
    borderTopWidth: 1,
    alignItems: "center",
  },
  noBorder: {
    borderTopWidth: 0,
  },
  amount: {
    marginLeft: "auto",
    fontFamily: Fonts.bold,
  },
  amountPos: {
    color: Colors.lightBlue,
  },
  amountNeg: {
    color: Colors.purple,
  },
  balanceChangeWrapper: {
    flexDirection: "row",
  },
  itemInfoWrapper: {
    marginLeft: 10,
    flex: 1,
    paddingRight: 40,
  },
  itemHash: {
    fontSize: 10,
  },
  itemDate: {
    marginBottom: 5,
    color: Colors.grey,
  },
});
export default Transactions;
