import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/auth";
import { KeyboardAvoidingView, Platform } from "react-native";

import { View, StyleSheet, Alert, Image } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { getApplications } from "@/service/get-applications";

export function Auth() {
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [appId, setAppId] = useState<string>("");
  const [applicationList, setApplicationList] = useState<any>([]);
  const [secureInput, setSecureInput] = useState(true);

  useEffect(() => {
    handleFetch();
  }, []);

  async function handleFetch() {
    try {
      const response = await getApplications();
      const itens = response.map((application) => {
        return {
          label: application.nomeReferencia,
          value: application.id,
        };
      });

      setApplicationList(itens);
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  }

  function handleSignIn() {
    if (!name || !password) {
      Alert.alert("Preencha os campos para fazer o login");
      return;
    }

    signIn(appId, name, password);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Image
        source={require("@/assets/logo-dark.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.input}>
        <Dropdown
          label="Aplicação"
          placeholder="Selecione a aplicacão"
          options={applicationList}
          value={appId}
          onSelect={setAppId}
        />
      </View>

      <TextInput
        placeholder="Usuário"
        value={name}
        onChangeText={setName}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry={secureInput}
        right={
          <TextInput.Icon
            icon={secureInput ? "eye-off" : "eye"}
            onPress={() => setSecureInput(!secureInput)}
          />
        }
      />

      <Button
        mode="contained"
        onPress={handleSignIn}
        style={styles.button}
        icon={({ color }) => (
          <MaterialCommunityIcons name="logout" size={22} color={color} />
        )}
        uppercase
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabelStyle}
      >
        Acessar
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 24,
  },
  logo: {
    width: "80%",
    alignSelf: "center",
  },
  buttonContent: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonLabelStyle: {
    fontSize: 16,
  },
});
