import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants";
import AppText from "./text";

const Button = (props) => {
  return (
    <TouchableOpacity disabled={props.disabled} onPress={() => props.onPress()}>
      <View
        style={[
          styles.button,
          props.style,
          props.disabled ? styles.disabled : {},
        ]}
      >
        {props.text && (
          <AppText style={[styles.buttonText, props.textStyle]}>
            {props.text}
          </AppText>
        )}
        {!props.text && <View> {props.children}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.green,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    textAlign: "center",
    alignItems: "center",
  },
});

export default Button;
