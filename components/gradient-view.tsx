import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "~/constants";

const GradientView = (props: { children?: ReactNode }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.fadeLight, Colors.transparent]}
        style={styles.gradient}
      />
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  gradient: {
    position: "absolute",
    left: "-100%",
    right: 0,
    top: "-160%",
    height: "200%",
    width: "400%",
    transform: [{ rotate: "40deg" }],
  },
});
export default GradientView;
