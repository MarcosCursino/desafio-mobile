import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth } from "@/app/screens/auth";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="auth" component={Auth} />
    </Stack.Navigator>
  );
}
