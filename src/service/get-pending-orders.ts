import { api } from "@/lib/axios";

export interface GetPendingOrdersBody {
  aplicacaoid?: string;
  username?: string;
  page: number;
  cpfCnpj?: string;
}

export interface ItemOrder {
  numeroFatura: string;
  historico: string;
  valorFatura: number;
  pessoa: {
    cpfCnpj: string;
    codigo: string;
    nome: string;
  };
}

export interface GetPendingOrdersResponse {
  list: ItemOrder[];
  totalPages: number;
  pageIndex: number;
}

export async function getPendingOrders({
  aplicacaoid,
  username,
  page,
  cpfCnpj,
}: GetPendingOrdersBody) {
  const response = await api.get<GetPendingOrdersResponse>(
    "/financeiro/faturas",
    {
      headers: {
        aplicacaoid,
        username,
        page,
        cpfCnpj,
      },
    }
  );
  return response.data;
}
