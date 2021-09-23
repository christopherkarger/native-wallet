import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import { ILocalWallet } from "~/db";
import AppText from "../components/text";

const SingleWallet = (props) => {
  const [data] = useState<ILocalWallet>(props.route.params.data);

  useEffect(() => {
    console.log(data);
  }, []);
  return (
    <SafeArea>
      <SubPageHeader navigation={props.navigation}>{data.name}</SubPageHeader>
      <View style={styles.inner}>
        <AppText>
          Balance: {data.balance} {data.currency}
        </AppText>
        <AppText>Adresse: {data.address}</AppText>
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
  },
});

export default SingleWallet;
