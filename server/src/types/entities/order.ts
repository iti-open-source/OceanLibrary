import { HydratedDocument, Types } from "mongoose";

export interface IOrderItem {
  bookId: Types.ObjectId;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = "cash" | "paymob";
export type OrderStatus =
  | "pending"
  | "shipped"
  | "delivered"
  | "canceled"
  | "on-the-way";
export type PaymentStatus = "pending" | "paid";

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status?: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentLink?: string;
  paymentOrderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;
