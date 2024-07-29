import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

import { Orders } from "@/app/screens/orders";
import { Payment } from "@/app/screens/payment";
import { PaymentProcess } from "@/app/screens/payment-process";

import { ItemOrder } from "@/service/get-pending-orders";

type AppRoutes = {
  orders: undefined;
  payment: {
    selectedItems: ItemOrder[];
  };
  paymentProcess: {
    selectedItems: ItemOrder[];
    paymentType: number;
  };
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppStack() {
  return (
    <Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#7845AC",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Screen name="orders" options={{ title: "Faturas" }} component={Orders} />
      <Screen
        name="payment"
        options={{ title: "Pedido" }}
        component={Payment}
      />
      <Screen
        name="paymentProcess"
        options={{ title: "Pagamento" }}
        component={PaymentProcess}
      />
    </Navigator>
  );
}
