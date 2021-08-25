import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants";

const GradientView = (props) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#BAB4FF", "transparent"]}
        style={styles.gradient}
      />
      <SafeAreaView style={styles.appContent}>{props.children}</SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },

  appContent: {
    paddingTop: 15,
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
