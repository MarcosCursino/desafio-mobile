import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  storageAuthDataSave,
  storageAuthDataRemove,
  storageAuthDataGet,
} from "@/storage/storageAuth";

import { signIn as signInService } from "@/service/sign-in";
import { Alert } from "react-native";
import { AxiosError } from "axios";

export interface AuthData {
  username: string;
  aplicacaoid: string;
}

interface ErrorResponse {
  title: string;
  extensions: {
    traceIdActivity: string;
    traceIdContext: string;
  };
}

type AuthContextProviderProps = {
  children: ReactNode;
};

interface AuthContextDataProps {
  authData?: AuthData;
  signIn: (id: string, userName: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [authData, setAuthData] = useState<AuthData>();
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const authDataSerialized = await storageAuthDataGet();
      if (authDataSerialized) {
        setAuthData(authDataSerialized);
      } else {
        setAuthData(undefined);
      }
    } catch (error) {
      console.error("Erro ao carregar dados de autenticação:", error);
      setAuthData(undefined);
    } finally {
      setisLoading(false);
    }
  }

  async function signIn(id: string, userName: string, password: string) {
    try {
      const { data } = await signInService({ id, userName, password });
      storageAuthDataSave({
        aplicacaoid: data.credenciais[0].aplicacaoid,
        username: data.credenciais[0].username,
      });
      setAuthData(data.credenciais[0]);
    } catch (error) {
      Alert.alert("Atenção", "Erro ao efetuar login");
    }
  }

  async function signOut() {
    setAuthData(undefined);
    storageAuthDataRemove();
  }

  return (
    <AuthContext.Provider value={{ authData, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextDataProps {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
