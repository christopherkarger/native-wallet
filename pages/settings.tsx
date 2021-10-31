import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import Button from "~/components/button";
import GradientView from "~/components/gradient-view";
import SafeArea from "~/components/safe-area";
import SubPageHeader from "~/components/sub-page-header";
import AppText from "~/components/text";
import { PathNames, UPDATE_WALLETS_EVENT } from "~/constants";
import { resetLocalDbWallets, selectLocalDBTableWallets } from "~/db";
import { ActiveLanguage } from "~/models/context";
import { Texts } from "~/texts";

const Settings = (props) => {
  const activeLanguage = useContext(ActiveLanguage);
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const [isDeletingDemoAccount, setIsDeletingDemoAccount] = useState(false);
  const isFocused = useIsFocused();

  const deleteDemo = async () => {
    if (isDeletingDemoAccount) {
      return;
    }
    setIsDeletingDemoAccount(true);
    try {
      await resetLocalDbWallets();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeletingDemoAccount(false);
      DeviceEventEmitter.emit(UPDATE_WALLETS_EVENT, true);
      props.navigation.navigate(PathNames.homeTab);
    }
  };

  useEffect(() => {
    if (!isFocused) {
      return;
    }
    (async () => {
      const localWallets = await selectLocalDBTableWallets().catch(() => {});
      if (localWallets && localWallets.rows.length) {
        setIsDemoAccount(localWallets.rows._array.some((x) => x.demoAddress));
      } else {
        setIsDemoAccount(false);
      }
    })();
  }, [isFocused]);

  return (
    <GradientView>
      <SafeArea>
        <SubPageHeader navigation={props.navigation}>
          {Texts.settings[activeLanguage]}
        </SubPageHeader>
        <View style={styles.inner}>
          {isDemoAccount && (
            <Button onPress={deleteDemo}>
              <AppText>{Texts.deleteDemo[activeLanguage]}</AppText>
            </Button>
          )}
        </View>
      </SafeArea>
    </GradientView>
  );
};

const styles = StyleSheet.create({
  inner: {
    marginHorizontal: 20,
    flex: 1,
  },
});

export default Settings;
