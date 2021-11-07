import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./text";

export const TextButton = (props) => {
  const Button = (
    <TouchableOpacity
      disabled={props.disabled}
      style={[styles.button, props.style]}
      onPress={() => props.onPress()}
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
