import { paymentMethod, SaleType } from "@prisma/client";

export interface SaleItem {
  saleId: string;
  productId: string;
  qty: number;
  productPrice: number;
  productName: string;
  productImage: string;
}

export interface SaleRequestBody {
  customerId: string;
  customerName: string;
  customerEmail: string;
  saleAmount: number;
  shopId: string;
  balanceAmount: number;
  cashPaidAmount: number;
  upiPaidAmount: number;
  saleType: SaleType;
  paymentMethod: paymentMethod;
  transactionCode: string;
  saleItems: SaleItem[];
}
