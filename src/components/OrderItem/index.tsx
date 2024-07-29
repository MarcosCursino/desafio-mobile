import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Checkbox } from "expo-checkbox";
import { ItemOrder } from "@/service/get-pending-orders";

import { Card, Text } from "react-native-paper";
import { toCurrency } from "@/utils/currency";

interface IProps {
  item: ItemOrder;
  OnSelect: (item: ItemOrder, isSelected: boolean) => void;
}

export function OrderItem({ item, OnSelect }: IProps) {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleCheckBoxChange(newValue: boolean) {
    setIsChecked(newValue);

    if (OnSelect) {
      OnSelect(item, newValue);
    }
  }

  function handlePress() {
    const newValue = !isChecked;

    setIsChecked(newValue);
    if (OnSelect) {
      OnSelect(item, newValue);
    }
  }

  return (
    <Card style={{ marginRight: 16 }}>
      <Card.Title
        title={`Tipo: ${item.historico}`}
        subtitle={`Responsável: ${item.pessoa.nome} (Código: ${item.pessoa.codigo})`}
      />
      <Card.Content>
        <Text variant="headlineSmall">
          Valor: {toCurrency(item.valorFatura)}
        </Text>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handlePress}
        >
          <Checkbox
            value={isChecked}
            onValueChange={handleCheckBoxChange}
            color={isChecked ? "#22c55e" : undefined}
          />
          <Text variant="labelMedium" style={styles.checkboxLabel}>
            Selecionar Fatura
          </Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#000",
    marginLeft: 8,
  },
});
