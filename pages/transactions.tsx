import React, { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { Colors } from "~/constants";
import { ActiveLanguageContext } from "~/models/context";
import { Texts } from "~/texts";
const Transactions = (props) => {
  if (!props.route?.params?.transactions) {
    throw new Error("transactions not provied");
  }
  const [transactions] = useState(props.route.params.transactions);
  const [activeLanguage] = useContext(ActiveLanguageContext);
  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {Texts.transactions[activeLanguage]}
        </SubPageHeader>
        <FlatList
          style={styles.transactionsList}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
          data={transactions}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.transactionItem}>
                <AppText>{item.balance_change}</AppText>
              </View>
            );
          }}
        ></FlatList>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    paddingVertical: 10,
    borderBottomColor: Colors.lightWhite,
    borderBottomWidth: 1,
  },
});
export default Transactions;
