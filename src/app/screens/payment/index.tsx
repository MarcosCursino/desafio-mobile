import React from "react";

import { useRoute } from "@react-navigation/native";

import { toCurrency } from "@/utils/currency";

import { View, StyleSheet } from "react-native";
import { Text, Card, Title, Button, Portal, Dialog } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@/routes/app-stack";
import { RouteParamsPaymentProps } from "@/types/route-payment-props";
import { useAuth } from "@/contexts/auth";

export function Payment() {
  const route = useRoute();
  const { signOut } = useAuth();

  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const [visible, setVisible] = React.useState(false);

  const { selectedItems } = route.params as RouteParamsPaymentProps;

  const amount = selectedItems.reduce((accumulator, currentOrder) => {
    return accumulator + currentOrder.valorFatura;
  }, 0);

  function handleSelectPayment(paymentId: number) {
    navigation.navigate("paymentProcess", {
      selectedItems,
      paymentType: paymentId,
    });
  }

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Card style={styles.totalCard}>
        <Card.Content>
          <Title>Valor Total:</Title>
          <Text variant="displaySmall"> {toCurrency(amount)}</Text>
        </Card.Content>
      </Card>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Resumo do pedido</Dialog.Title>
          <Dialog.Content style={styles.itemDetail}>
            {selectedItems.map((item) => {
              return (
                <View key={item.numeroFatura}>
                  <Text variant="titleMedium">Tipo: {item.historico}</Text>
                  <Text variant="labelLarge">
                    Responsável: {item.pessoa.nome} (Código:
                    {item.pessoa.codigo})
                  </Text>
                  <Text variant="labelLarge">
                    Valor: {toCurrency(item.valorFatura)}
                  </Text>
                </View>
              );
            })}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Fechar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Button
        icon={({ color }) => (
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={22}
            color={color}
          />
        )}
        mode="contained"
        onPress={showDialog}
        contentStyle={styles.buttonDetail}
        labelStyle={styles.buttonText}
      >
        Resumo do pedido
      </Button>

      <Text variant="headlineMedium">Selecione o Pagamento:</Text>

      <View style={styles.buttonGroup}>
        <Button
          mode="outlined"
          icon={({ color }) => (
            <MaterialCommunityIcons
              name="credit-card"
              size={22}
              color={color}
            />
          )}
          contentStyle={styles.paymentButton}
          onPress={() => handleSelectPayment(0)}
          uppercase
        >
          crédito
        </Button>
        <Button
          mode="outlined"
          contentStyle={styles.paymentButton}
          icon={({ color }) => (
            <MaterialCommunityIcons
              name="credit-card"
              size={22}
              color={color}
            />
          )}
          onPress={() => handleSelectPayment(1)}
          uppercase
        >
          débito
        </Button>

        <Button
          mode="outlined"
          contentStyle={styles.paymentButton}
          icon={({ color }) => (
            <MaterialCommunityIcons name="qrcode" size={22} color={color} />
          )}
          onPress={() => handleSelectPayment(2)}
          uppercase
        >
          pix
        </Button>
      </View>

      <Button
        mode="contained-tonal"
        style={{ marginTop: "auto" }}
        contentStyle={styles.buttonDetail}
        labelStyle={styles.buttonText}
        icon={({ color }) => (
          <MaterialCommunityIcons name="logout" size={22} color={color} />
        )}
        onPress={signOut}
        uppercase
      >
        Sair
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
    paddingBottom: 20,
    gap: 20,
  },
  totalCard: {
    marginTop: 20,
  },
  buttonGroup: {
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 16,
    gap: 16,
  },
  paymentButton: {
    height: 80,
  },
  itemDetail: {
    gap: 12,
  },
  buttonDetail: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
  },
});
