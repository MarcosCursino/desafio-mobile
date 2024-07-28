import axios from "axios";

export const api = axios.create({
  baseURL: "https://api-pedido-erp-gateway-prod.saurus.net.br/api/v2/",
});
