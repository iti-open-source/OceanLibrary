import { Types } from "mongoose";

export interface OrderItem {
  bookId: Types.ObjectId;
  title: string;
  image: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = "cash" | "paymob";
export type OrderStatus = "pending" | "shipped" | "delivered" | "canceled" | "on-the-way";
export type PaymentStatus = "pending" | "paid";

export interface Order {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: OrderItem[];
  total: number;
  status?: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentLink?: string;
  paymentOrderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
