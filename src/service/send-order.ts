import { api } from "@/lib/axios";

export interface ItemFatura {
  numeroFatura: string;
  historico: string;
  valorFatura: number;
  pagamentoParcial: boolean;
  pessoa: {
    cpfCnpj: string;
    codigo: string;
    nome: string;
  };
}

export interface ItemOrder {
  faturas: ItemFatura[];
  valorTotal: number;
  resultadoTransacao: {
    idTransacao: string;
    nsu: string;
    codAut: string;
    codControle: string;
    dRetorno: string;
    numCartao: string;
    bandeira: string;
    rede: string;
    adquirente: string;
    valorPagamento: number;
    tipoPagamento: number;
    qtdeParcelas: number;
    dTransacao: string;
    status: number;
    msgRetorno: string;
    arqRetorno: string;
  };
}

export interface SendOrderBody {
  aplicacaoid?: string;
  username?: string;
  itemOrder: ItemOrder;
}

export async function sendOrder({
  aplicacaoid,
  username,
  itemOrder,
}: SendOrderBody) {
  return await api.post("/financeiro/retorno", itemOrder, {
    headers: {
      aplicacaoid,
      username,
    },
  });
}
