import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Icon,
} from "react-native-paper";

import { useAuth } from "@/contexts/auth";
import { sendOrder } from "@/service/send-order";

import { AppNavigatorRoutesProps } from "@/routes/app-stack";
import { delay } from "@/utils/delay";
import { generateRandomString } from "@/utils/generate-randon-string";
import { RouteParamsPaymentProps } from "@/types/route-payment-props";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function PaymentProcess() {
  const route = useRoute();

  const { authData } = useAuth();
  const navigation = useNavigation<AppNavigatorRoutesProps>();

  const { selectedItems, paymentType } =
    route.params as RouteParamsPaymentProps;

  // Status: 0: Default; 1: Running payment; 2: Payment Success; 3: Payment Error
  const [paymentStatus, setPaymentStatus] = useState<number>(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [pixKey, setPixKey] = useState("");

  const amount = selectedItems.reduce((accumulator, currentOrder) => {
    return accumulator + currentOrder.valorFatura;
  }, 0);

  async function handleProcessOrder() {
    if (paymentType === 2) {
      if (!pixKey) {
        Alert.alert("Preencha a chave PIX para concluir o pagamento");
        return;
      }
    } else {
      if (!cardNumber || !cardCvv || !cardDate) {
        Alert.alert(
          "Preencha todos os campos para concluir o pagamento com cartão"
        );
        return;
      }
    }

    const postData = {
      faturas: selectedItems.map((item) => ({
        numeroFatura: item.numeroFatura,
        historico: item.historico,
        valorFatura: amount,
        pagamentoParcial: false,
        pessoa: {
          cpfCnpj: item.pessoa.cpfCnpj,
          codigo: item.pessoa.codigo,
          nome: item.pessoa.nome,
        },
      })),
      valorTotal: amount,
      resultadoTransacao: {
        idTransacao: generateRandomString(12),
        nsu: generateRandomString(8),
        codAut: generateRandomString(10),
        codControle: generateRandomString(6),
        dRetorno: new Date().toISOString(),
        numCartao: cardNumber,
        bandeira: "Visa",
        rede: "Rede Fictícia",
        adquirente: "Adquirente Fictício",
        valorPagamento: amount,
        tipoPagamento: 1,
        qtdeParcelas: 0,
        dTransacao: new Date().toISOString(),
        status: 1,
        msgRetorno: "Transação aprovada",
        arqRetorno: "N/A",
      },
    };

    try {
      setPaymentStatus(1);
      await sendOrder({
        aplicacaoid: authData?.aplicacaoid,
        username: authData?.username,
        itemOrder: postData,
      });

      await delay(2000);
      setPaymentStatus(2);
    } catch (error) {
      console.log("error", error);
      await delay(2500);
      setPaymentStatus(3);
    } finally {
      await delay(4000);
      navigation.navigate("orders");
    }
  }

  const bla: any = {
    0: "Credito",
    1: "Debito",
    2: "PIX",
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {paymentStatus === 0 ? (
        <>
          <Text variant="headlineLarge">Pagamento com {bla[paymentType]}</Text>
          <Text variant="bodyLarge">
            Para proseguir, preencha os campos abaixo:
          </Text>

          <View style={styles.containerData}>
            {paymentType === 2 ? (
              <TextInput
                placeholder="Chave PIX"
                value={pixKey}
                onChangeText={setPixKey}
                style={styles.input}
                autoCapitalize="none"
              />
            ) : (
              <>
                <TextInput
                  placeholder="Número do cartao"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  style={styles.input}
                  autoCapitalize="none"
                />

                <TextInput
                  placeholder="Validade"
                  value={cardDate}
                  onChangeText={setCardDate}
                  style={styles.input}
                  autoCapitalize="none"
                />

                <TextInput
                  placeholder="CVV"
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </>
            )}
          </View>

          <Button
            mode="contained"
            onPress={handleProcessOrder}
            style={styles.button}
            icon={({ color }) => (
              <MaterialCommunityIcons
                name="arrow-right"
                size={22}
                color={color}
              />
            )}
            uppercase
            contentStyle={styles.buttonDetail}
            labelStyle={styles.buttonText}
          >
            Processar pagamento
          </Button>
        </>
      ) : null}

      {paymentStatus === 1 ? (
        <View style={styles.containerPaymentStatus}>
          <Text variant="displayMedium" style={styles.title}>
            Aguardando o Pagamento
          </Text>
          <ActivityIndicator animating={true} color="#22c55e" size={150} />
        </View>
      ) : null}

      {paymentStatus === 2 ? (
        <View style={styles.containerPaymentStatus}>
          <Text variant="displayMedium" style={styles.title}>
            Pagamento Aprovado
          </Text>
          <View style={styles.paymentSucces}>
            <Icon source="check" size={120} color="white" />
          </View>
        </View>
      ) : null}

      {paymentStatus === 3 ? (
        <View style={styles.containerPaymentStatus}>
          <Text variant="displayMedium" style={styles.title}>
            Erro ao processar Pagamento
          </Text>

          <View style={styles.paymentError}>
            <Icon source="close" size={120} color="white" />
          </View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8fafc",
    paddingTop: 24,
  },
  containerData: {
    marginTop: 40,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: "auto",
    marginBottom: 20,
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
  title: {
    textAlign: "center",
    marginBottom: 120,
    marginTop: 60,
  },
  containerPaymentStatus: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  paymentSucces: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentError: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
});
