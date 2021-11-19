import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import CustomTabs from "~/components/custom-tabs";
import GradientView from "~/components/gradient-view";
import { Colors, PathNames } from "../constants";
import AddAssetScreen from "./add-asset";
import HomeScreen from "./home-screen";
import SettingsScreen from "./settings";

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <GradientView>
      <Tab.Navigator
        tabBar={(props) => <CustomTabs {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen
          name={PathNames.homeTab}
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="account-balance-wallet"
                size={25}
                color={focused ? Colors.lightBlue : Colors.white}
              />
            ),
          }}
        />
        <Tab.Screen
          name={PathNames.addAssetTab}
          component={AddAssetScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.addAssetButton}>
                <MaterialIcons
                  name="add"
                  size={25}
                  color={focused ? Colors.white : Colors.darkBlue}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name={PathNames.settings}
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name="settings"
                size={25}
                color={focused ? Colors.lightBlue : Colors.white}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  addAssetButton: {
    width: 32,
    height: 32,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});

export default BottomTabs;
