import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "~/constants";
import SubPageHeader from "../components/sub-page-header";

const AddWalletScreen = (props) => {
  const [cryptoName, setCryptoName] = useState("");

  return (
    <>
      <SubPageHeader navigation={props.navigation}>
        Neues Wallet anlegen
      </SubPageHeader>
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={cryptoName}
          onValueChange={(v) => setCryptoName(v)}
          accessibilityLabel="Styled Picker Accessibility Label"
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
      </View>
      {/* <TextInput
        style={styles.textInput}
        placeholder="Wallet Adresse"
      ></TextInput> */}
    </>
  );
};

const styles = StyleSheet.create({
  pickerWrapper: {
    backgroundColor: "red",
    width: 50,
    height: 50,
  },
  picker: {
    color: Colors.transparent,
    width: "100%",
    height: "100%",
    backgroundColor: Colors.transparent,
  },
  textInput: {
    borderColor: Colors.lightWhite,
    borderWidth: 2,
  },
});

export default AddWalletScreen;