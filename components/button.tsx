import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants";
import AppText from "./text";

const Button = (props) => {
  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => props.onPress()}
      >
        <View
          style={[
            styles.button,
            props.style,
            props.disabled ? styles.disabled : {},
          ]}
        >
          {!!props.text && (
            <AppText style={[styles.buttonText, props.textStyle]}>
              {props.text}
            </AppText>
          )}
          {!props.text && !!props.children && <View>{props.children}</View>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: "flex-start",
  },
  button: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: Colors.green,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
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
