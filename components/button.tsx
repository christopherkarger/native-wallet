import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Fonts } from "~/constants";
import AppText from "./text";

const Button = (props) => {
  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        disabled={props.disabled}
        onPress={() => props.onPress()}
      >
        <LinearGradient
          colors={[
            props.gradientStartColor ? props.gradientStartColor : Colors.purple,
            props.gradientEndColor ? props.gradientEndColor : Colors.lightBlue,
          ]}
          style={[
            styles.button,
            props.style,
            props.disabled ? styles.disabled : {},
          ]}
          start={[1, 0]}
          end={[0, 1]}
        >
          {!!props.text && (
            <AppText style={[styles.buttonText, props.textStyle]}>
              {props.text}
            </AppText>
          )}
          {!props.text && !!props.children && <View>{props.children}</View>}
        </LinearGradient>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    textAlign: "center",
    alignItems: "center",
    fontFamily: Fonts.bold,
  },
});

export default Button;
