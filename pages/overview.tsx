import { DefaultTheme } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import GradientView from "~/components/gradient-view";
import QrCodeScanner from "~/components/qr-code-scanner";
import { Colors, PathNames } from "../constants";
import AddWalletScreen from "./add-wallet";
import HomeScreen from "./home-screen";
import MarketdataItem from "./market-data-item";
import SingleWallet from "./single-wallet";

const Stack = createStackNavigator();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.transparent,
  },
};

const Overview = () => {
  return (
    <GradientView>
      <Stack.Navigator
        initialRouteName={PathNames.home}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name={PathNames.home} component={HomeScreen} />
        <Stack.Screen name={PathNames.addWallet} component={AddWalletScreen} />
        <Stack.Screen
          name={PathNames.marketDataItem}
          component={MarketdataItem}
        />
        <Stack.Screen name={PathNames.singleWallet} component={SingleWallet} />

        <Stack.Screen name={PathNames.scanCode} component={QrCodeScanner} />
      </Stack.Navigator>
    </GradientView>
  );
};

export default Overview;
