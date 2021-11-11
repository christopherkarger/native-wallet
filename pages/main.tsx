import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import React from "react";
import GradientView from "~/components/gradient-view";
import QrCodeScanner from "~/components/qr-code-scanner";
import { Colors, PathNames } from "~/constants";
import {
  createLocalDBTableAddressUpdate,
  createLocalDBTableMarket,
  createLocalDBTableSettings,
  createLocalDBTableWallets,
} from "~/db";
import AddWalletScreen from "./add-wallet";
import BottomTabs from "./bottom-tabs";
import MarketdataItem from "./market-data-item";
import SingleWallet from "./single-wallet";
import Transactions from "./transactions";

const Stack = createStackNavigator();

createLocalDBTableMarket().catch((err) => {
  console.error(err);
  console.warn("Local DB Table market could not be created");
});

createLocalDBTableWallets().catch((err) => {
  console.error(err);
  console.warn("Local DB Table wallets could not be created");
});

createLocalDBTableSettings().catch((err) => {
  console.error(err);
  console.warn("Local DB Table settings could not be created");
});

createLocalDBTableAddressUpdate().catch((err) => {
  console.error(err);
  console.warn("Local DB Table address-update could not be created");
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
          <Stack.Screen
            name={PathNames.addWallet}
            component={AddWalletScreen}
          />
          <Stack.Screen
            name={PathNames.marketDataItem}
            component={MarketdataItem}
          />
          <Stack.Screen
            name={PathNames.singleWallet}
            component={SingleWallet}
          />

          <Stack.Screen
            name={PathNames.transactions}
            component={Transactions}
          />

          <Stack.Screen name={PathNames.scanCode} component={QrCodeScanner} />
        </Stack.Navigator>
      </NavigationContainer>
    </GradientView>
  );
};

export default Main;
