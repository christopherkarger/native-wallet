import React, { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { IStyle } from "~/models/models";
import { Colors, Fonts } from "../constants";

const AppText = (props: { children?: ReactNode; style?: IStyle }) => {
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
