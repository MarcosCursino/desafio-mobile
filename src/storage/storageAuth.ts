import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_STORAGE = "@saurusapp:authData";

type StorageAuthDataProps = {
  username: string;
  aplicacaoid: string;
};

export async function storageAuthDataSave({
  username,
  aplicacaoid,
}: StorageAuthDataProps) {
  await AsyncStorage.setItem(
    AUTH_STORAGE,
    JSON.stringify({ username, aplicacaoid })
  );
}

export async function storageAuthDataGet(): Promise<StorageAuthDataProps | null> {
  const response = await AsyncStorage.getItem(AUTH_STORAGE);

  if (response) {
    try {
      const data = JSON.parse(response);
      if (data.username && data.aplicacaoid) {
        return data;
      }
    } catch (error) {
      console.error("Erro ao parsear os dados do armazenamento:", error);
    }
  }

  return null;
}

export async function storageAuthDataRemove() {
  await AsyncStorage.removeItem(AUTH_STORAGE);
}
