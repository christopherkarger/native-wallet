import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    paddingTop: 15,
  },
});
export default SafeArea;
