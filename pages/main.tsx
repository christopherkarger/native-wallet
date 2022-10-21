import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import GradientView from "~/components/gradient-view";
import QrCodeScanner from "~/components/qr-code-scanner";
import { Colors, PathNames } from "~/constants";
import { createLocalDBTableWallets } from "~/db";
import AddAssetScreen from "./add-asset";
import AddCoinScreen from "./add-coin";
import AddWalletScreen from "./add-wallet";
import BottomTabs from "./bottom-tabs";
import MarketdataItem from "./market-data-item";
import PortfolioOverview from "./portfolio-overview";
import SingleWalletScreen from "./single-wallet";

const Stack = createStackNavigator();

createLocalDBTableWallets().catch((err) => {
  console.error(err);
  console.warn("Local DB Table wallets could not be created");
});

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.transparent,
  },
};

const Main = () => {
  return (
    <GradientView>
      <NavigationContainer theme={AppTheme}>
        <Stack.Navigator
          initialRouteName={PathNames.home}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name={PathNames.home} component={BottomTabs} />
          <Stack.Screen name={PathNames.addAsset} component={AddAssetScreen} />
          <Stack.Screen
            name={PathNames.addWallet}
            component={AddWalletScreen}
          />
          <Stack.Screen name={PathNames.addCoin} component={AddCoinScreen} />
          <Stack.Screen
            name={PathNames.portfolioOverview}
            component={PortfolioOverview}
          />
          <Stack.Screen
            name={PathNames.marketDataItem}
            component={MarketdataItem}
          />
          <Stack.Screen
            name={PathNames.singleWallet}
            component={SingleWalletScreen}
          />
          <Stack.Screen name={PathNames.scanCode} component={QrCodeScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </GradientView>
  );
};

export default Main;
