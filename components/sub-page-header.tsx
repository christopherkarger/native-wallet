import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants";
import AppText from "./text";

const SubPageHeader = (props) => {
  return (
    <View style={{ ...styles.header, ...props.style }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => props.navigation.goBack()}
      >
        <MaterialIcons name="arrow-back-ios" size={22} color={Colors.white} />
      </TouchableOpacity>
      <AppText style={styles.headline}>{props.children}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 20,
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  headline: {
    fontSize: 20,
  },
});

export default SubPageHeader;
