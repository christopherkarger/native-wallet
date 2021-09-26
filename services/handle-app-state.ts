import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

const useAppStatus = () => {
  const appState = useRef(AppState.currentState);
  const [status, setStatus] = useState("active");
  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      setStatus("active");
    } else {
      setStatus("inactive");
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
