import React, { ReactNode } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { IStyle } from "~/models/models";
import AppText from "./text";

export const TextButton = (props: {
  disabled?: boolean;
  onPress: (e: GestureResponderEvent) => void;
  style?: IStyle;
  text?: string;
  textStyle?: IStyle;
  children?: ReactNode;
}) => {
  const Button = (
    <TouchableOpacity
      disabled={props.disabled}
      style={[styles.button, props.style]}
      onPress={(e) => props.onPress(e)}
    >
      {!!props.text && (
        <AppText style={[styles.buttonText, props.textStyle]}>
          {props.text}
        </AppText>
      )}
      {!props.text && !!props.children && <View>{props.children}</View>}
    </TouchableOpacity>
  );

  if (props.disabled) {
    return <View style={styles.disabled}>{Button}</View>;
  }
  return <>{Button}</>;
};

const styles = StyleSheet.create({
  button: {},
  buttonText: {},
  disabled: {
    opacity: 0.5,
  },
});
