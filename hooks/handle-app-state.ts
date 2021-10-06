import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export enum AppStaus {
  Active = "active",
  Inactive = "inactive",
}

const useAppStatus = () => {
  const appState = useRef(AppState.currentState);
  const [status, setStatus] = useState(AppStaus.Active);
  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === AppStaus.Active
    ) {
      setStatus(AppStaus.Active);
    } else {
      setStatus(AppStaus.Inactive);
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  return status;
};

export default useAppStatus;
