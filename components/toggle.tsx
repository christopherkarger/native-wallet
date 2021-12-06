import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, Fonts } from "~/constants";
import AppText from "./text";

let toggleTimeout: NodeJS.Timeout | undefined;
const THRESHOLD = 150;

const Toggle = (props) => {
  const [active, setActive] = useState<boolean[]>([]);

  useEffect(() => {
    setActive(props.active);
  }, []);

  return (
    <View style={styles.toggleWrapper}>
      <TouchableOpacity
        disabled={active[0]}
        style={[
          styles.toggleButton,
          active[0] ? styles.toggleButtonActive : {},
        ]}
        onPress={() => {
          setActive([true, false]);
          if (toggleTimeout) {
            clearTimeout(toggleTimeout);
          }
          toggleTimeout = setTimeout(() => {
            props.toggle(0);
          }, THRESHOLD);
        }}
      >
        <AppText
          style={[
            styles.toggleButtonText,
            active[0] ? styles.toggleButtonActiveText : {},
          ]}
        >
          {props.text[0]}
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={active[1]}
        style={[
          styles.toggleButton,
          active[1] ? styles.toggleButtonActive : {},
        ]}
        onPress={() => {
          setActive([false, true]);
          if (toggleTimeout) {
            clearTimeout(toggleTimeout);
          }
          toggleTimeout = setTimeout(() => {
            props.toggle(1);
          }, THRESHOLD);
        }}
      >
        <AppText
          style={[
            styles.toggleButtonText,
            active[1] ? styles.toggleButtonActiveText : {},
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
