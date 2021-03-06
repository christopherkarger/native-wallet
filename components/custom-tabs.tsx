import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, PathNames } from "~/constants";
import { randomString } from "~/services/helper";
const CustomTabs = ({ state, descriptors, navigation }) => {
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    return () => {
      Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
      Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => setKeyboard(true);

  const _keyboardDidHide = () => {
    setTimeout(() => {
      setKeyboard(false);
    }, 200);
  };

  return (
    <View style={[styles.wrapper, keyboard ? styles.hide : {}]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        let path: string;

        switch (route.name) {
          case PathNames.addAssetTab:
            path = PathNames.addAsset;
            break;
          default:
            path = route.name;
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: path,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: path, merge: true });
          }
        };

        let TabIcon = options.tabBarIcon({
          color: Colors.white,
          focused: isFocused,
        });

        return (
          <TouchableOpacity
            accessibilityRole="button"
            key={randomString()}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onPress}
            style={styles.tab}
          >
            {TabIcon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.bgDark,
    borderTopColor: Colors.darkBlue,
    borderTopWidth: 1,
    flexDirection: "row",
    width: "100%",
    height: 50,
    justifyContent: "space-around",
    alignItems: "center",
  },

  tab: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  hide: {
    display: "none",
  },
});

export default CustomTabs;
