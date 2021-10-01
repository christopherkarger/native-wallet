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
        <View style={styles.backButtonIcon}>
          <MaterialIcons name="arrow-back-ios" size={22} color={Colors.white} />
        </View>
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
    top: -5,
    left: 0,
    width: 55,
    height: 40,
  },
  headline: {
    fontSize: 20,
  },
  backButtonIcon: {
    position: "absolute",
    top: 7,
    left: 20,
  },
});

export default SubPageHeader;
