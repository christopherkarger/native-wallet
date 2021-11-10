import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { SafeAreaView as DefaultSaveAreaView } from "react-native-safe-area-context";
import { isIOS } from "~/constants";

const SafeArea = (props) => {
  if (isIOS) {
    return (
      <SafeAreaView style={[styles.areaView, props.style]}>
        {props.children}
      </SafeAreaView>
    );
  }

  return (
    <DefaultSaveAreaView style={[styles.defaulArea, props.style]}>
      {props.children}
    </DefaultSaveAreaView>
  );
};
const styles = StyleSheet.create({
  areaView: {
    flex: 1,
  },
  defaulArea: {
    flex: 1,
    paddingTop: 10,
  },
});
export default SafeArea;
