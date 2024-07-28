import { api } from "@/lib/axios";

export interface SignInResponse {
  credenciais: [
    {
      username: string;
      aplicacaoid: string;
    }
  ];
}

export interface SignInBody {
  id: string;
  userName: string;
  password: string;
}

export const signIn = async ({ id, userName, password }: SignInBody) => {
  return api.post<SignInResponse>("/auth", {
    aplicacaoId: id,
    usuario: userName,
    senha: password,
  });
};
