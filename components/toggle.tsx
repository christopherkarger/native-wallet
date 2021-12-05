import React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, Fonts } from "~/constants";
import AppText from "./text";

const Toggle = (props) => {
  return (
    <View style={styles.toggleWrapper}>
      <TouchableOpacity
        disabled={props.active[0]}
        style={[
          styles.toggleButton,
          props.active[0] ? styles.toggleButtonActive : {},
        ]}
        onPress={() => props.toggle(0)}
      >
        <AppText
          style={[
            styles.toggleButtonText,
            props.active[0] ? styles.toggleButtonActiveText : {},
          ]}
        >
          {props.text[0]}
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={props.active[1]}
        style={[
          styles.toggleButton,
          props.active[1] ? styles.toggleButtonActive : {},
        ]}
        onPress={() => props.toggle(1)}
      >
        <AppText
          style={[
            styles.toggleButtonText,
            props.active[1] ? styles.toggleButtonActiveText : {},
          ]}
        >
          {props.text[1]}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  toggleButtonText: {
    fontFamily: Fonts.bold,
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleButtonActiveText: {
    color: Colors.bgDark,
  },
  item: {
    marginBottom: 30,
  },
  itemHeadline: {
    marginBottom: 10,
  },
});

export default Toggle;
