import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, PathNames } from "~/constants";
import { randomString } from "~/services/helper";

const CustomTabs = (props: BottomTabBarProps) => {
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
    const hideSub = Keyboard.addListener("keyboardDidHide", _keyboardDidHide);
    return () => {
      showSub.remove();
      hideSub.remove();
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
      {props.state.routes.map(
        (route: { name: string; key: string }, index: number) => {
          const { options } = props.descriptors[route.key];
          const isFocused = props.state.index === index;
          let path: string;

          switch (route.name) {
            case PathNames.addAssetTab:
              path = PathNames.addAsset;
              break;
            default:
              path = route.name;
          }

          const onPress = () => {
            const event = props.navigation.emit({
              type: "tabPress",
              target: path,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              props.navigation.navigate(path, { merge: true });
            }
          };

          if (!options.tabBarIcon) {
            return <Text>Tabbar icon not set</Text>;
          }

          const TabIcon = options.tabBarIcon({
            size: 25,
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
        }
      )}
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
