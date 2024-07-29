import React, { useState, useEffect, useMemo } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { useAuth } from "@/contexts/auth";
import { getPendingOrders, ItemOrder } from "@/service/get-pending-orders";
import { OrderItem } from "@/components/OrderItem";

import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@/routes/app-stack";

import { Button, Searchbar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function Orders() {
  const { authData } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const [orders, setOrders] = useState<ItemOrder[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<ItemOrder[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const filteredOrders = useMemo(() => {
    if (searchText) {
      const lowercasedSearchText = searchText.toLowerCase();

      return orders.filter((order) => {
        const isCNPJMatch = order.pessoa.cpfCnpj
          .toString()
          .includes(lowercasedSearchText);

        const isNameMatch = order.pessoa.nome
          .toLowerCase()
          .includes(lowercasedSearchText);

        const isCodeMatch = order.pessoa.codigo
          .toString()
          .includes(lowercasedSearchText);

        return isCNPJMatch || isNameMatch || isCodeMatch;
      });
    } else {
      return orders;
    }
  }, [searchText, orders]);

  useEffect(() => {
    handleFetch();
  }, []);

  async function handleFetch() {
    if (!hasMoreData) {
      return;
    }

    try {
      const response = await getPendingOrders({
        aplicacaoid: authData?.aplicacaoid,
        username: authData?.username,
        page,
      });

      if (response.list) {
        setOrders((prevOrders) => [...prevOrders, ...response.list]);

        if (response.pageIndex < response.totalPages) {
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMoreData(false);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  }

  const handleSelect = (item: ItemOrder, isSelected: boolean) => {
    setSelectedItems((prevSelectedItems) => {
      if (isSelected) {
        return [...prevSelectedItems, item];
      } else {
        return prevSelectedItems.filter(
          (selectedItem) => selectedItem.numeroFatura !== item.numeroFatura
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar por CNPJ, nome ou código"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
        autoCapitalize="none"
      />

      {filteredOrders.length === 0 ? (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text variant="headlineSmall">Nenhum pedido encontrado.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={({ item }) => (
            <OrderItem item={item} OnSelect={handleSelect} />
          )}
          keyExtractor={(item) => item.numeroFatura}
          onEndReached={handleFetch}
          onEndReachedThreshold={0.1}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      <Button
        mode="contained"
        onPress={() =>
          navigation.navigate("payment", {
            selectedItems,
          })
        }
        style={styles.button}
        icon={({ color }) => (
          <MaterialCommunityIcons name="cart" size={22} color={color} />
        )}
        uppercase
        disabled={selectedItems.length === 0}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonText}
      >
        Receber
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  input: {
    marginBottom: 20,
    borderRadius: 4,
  },
  button: {
    marginTop: "auto",
  },
  buttonContent: {
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
