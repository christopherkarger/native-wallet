import { MaterialIcons } from "@expo/vector-icons";
import React, { useContext, useMemo, useState } from "react";
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

  const renderedListItem = (listProps) => {
    const positiveChange = +listProps.item.balance_change > 0;
    return (
      <View
        style={[
          styles.transactionItem,
          listProps.index === 0 ? styles.noBorder : {},
        ]}
      >
        <View style={styles.transactionItemInner}>
          <MaterialIcons
            style={styles.itemIcon}
            name={positiveChange ? "arrow-circle-down" : "arrow-circle-up"}
            size={40}
            color={positiveChange ? Colors.lightBlue : Colors.purple}
          />
          <View style={styles.itemInfoWrapper}>
            {listProps.item.time && (
              <DateTime
                style={styles.itemDate}
                date={listProps.item.time}
                withTime={true}
              ></DateTime>
            )}
            <AppText style={styles.itemHash}>
              {Texts.hash[activeLanguage]}
            </AppText>
            <AppText style={styles.itemHash}>
              {listProps.item.hash ?? "-"}
            </AppText>
          </View>
        </View>
        <AppText
          style={[
            styles.amount,
            positiveChange ? styles.amountPos : styles.amountNeg,
          ]}
        >
          {formatNumber({
            number: listProps.item.balance_change,
            decimal: "00000000",
            language: activeLanguage,
          })}
        </AppText>
      </View>
    );
  };

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
          renderItem={useMemo(() => renderedListItem, [activeLanguage])}
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
    paddingVertical: 10,
    borderTopColor: Colors.lightWhite,
    borderTopWidth: 1,
  },
  transactionItemInner: {
    alignItems: "center",
    flexDirection: "row",
  },
  noBorder: {
    borderTopWidth: 0,
  },
  amount: {
    fontSize: 17,
    marginLeft: "auto",
    fontFamily: Fonts.bold,
    paddingTop: 10,
    paddingBottom: 5,
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
    fontSize: 12,
  },
  itemDate: {
    marginBottom: 5,
    color: Colors.grey,
  },
  itemIcon: {
    transform: [{ rotate: "45deg" }],
  },
});
export default Transactions;
