import { StyleProp } from "react-native";

export interface INavigation {
  navigate: (
    path: string | { name: string; merge: boolean },
    data?: unknown
  ) => void;
  goBack: () => void;
  emit: (args: any) => any;
}

export type IStyle = StyleProp<any>;
