import { ItemOrder } from "@/service/get-pending-orders";

export type RouteParamsPaymentProps = {
  selectedItems: ItemOrder[];
  paymentType: number;
};
