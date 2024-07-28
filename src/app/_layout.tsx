import { View, StatusBar } from "react-native";
import { Slot } from "expo-router";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Slot />
    </View>
  );
}
