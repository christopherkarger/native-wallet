import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppText from "./text";

export const TextButton = (props) => {
  return (
    <View
      style={[
        styles.button,
        props.style,
        props.disabled ? styles.disabled : {},
      ]}
    >
      <TouchableOpacity onPress={() => props.onPress()}>
        {!!props.text && (
          <AppText style={[styles.buttonText, props.textStyle]}>
            {props.text}
          </AppText>
        )}
        {!props.text && !!props.children && <View>{props.children}</View>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
  },
  buttonText: {},
  disabled: {},
});
