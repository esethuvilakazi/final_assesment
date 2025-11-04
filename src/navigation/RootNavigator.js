import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import AuthStack from "./AuthStack";
import AppTabs from "./AppTabs";
import { ActivityIndicator, View } from "react-native";

const RootNavigator = () => {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppTabs /> : <AuthStack />;
};

export default RootNavigator;
