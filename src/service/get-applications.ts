import { api } from "@/lib/axios";

export interface GetApplicationsResponse {
  id: string;
  nomeReferencia: string;
}

export async function getApplications() {
  const response = await api.get<GetApplicationsResponse[]>("/aplicacoes");
  return response.data;
}
