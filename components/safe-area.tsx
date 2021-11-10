import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

const SafeArea = (props) => {
  return (
    <SafeAreaView style={[styles.areaView, props.style]}>
      {props.children}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  areaView: {
    flex: 1,
  },
});
export default SafeArea;
