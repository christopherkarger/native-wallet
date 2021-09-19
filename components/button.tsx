import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "~/constants";
import AppText from "./text";

const Button = (props) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress()}
      style={{ ...styles.button, ...props.style }}
    >
      {props.text && <AppText style={styles.buttonText}>{props.text}</AppText>}
      {!props.text && <View> {props.children}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.green,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },

  buttonText: {
    textAlign: "center",
    alignItems: "center",
  },
});

export default Button;
