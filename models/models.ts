import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import { NavigationHelpers, ParamListBase } from "@react-navigation/native";
import { StyleProp } from "react-native";

export type INavigation = NavigationHelpers<
  ParamListBase,
  BottomTabNavigationEventMap
>;
export type IStyle = StyleProp<any>;
