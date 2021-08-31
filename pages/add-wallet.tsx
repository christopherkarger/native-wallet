import React from "react";
import { StyleSheet } from "react-native";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  return (
    <>
      <SubPageHeader navigation={props.navigation}>
        Neues Wallet anlegen
      </SubPageHeader>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
});

export default AddWalletScreen;
