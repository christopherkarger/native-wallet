import React from "react";
import { StyleSheet, Text } from "react-native";
import { Colors, Fonts } from "../constants";

const AppText = (props) => {
  if (!props.children) {
    return <Text>Please provide children for AppText!</Text>;
  }

  return <Text style={[styles.text, props.style]}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontFamily: Fonts.regular,
  },
});

export default AppText;
