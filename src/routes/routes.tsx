import { NavigationContainer } from "@react-navigation/native";

import { AppStack } from "./app-stack";
import { AuthStack } from "./auth-stack";
import { useAuth } from "@/contexts/auth";

export function Router() {
  const { authData } = useAuth();

  return (
    <NavigationContainer independent={true}>
      {authData ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
