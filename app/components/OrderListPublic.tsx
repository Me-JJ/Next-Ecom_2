"use client";
import Image from "next/image";
import React from "react";
import dateFormat from "dateformat";
import { Chip } from "@material-tailwind/react";
import { formatPrice } from "../utils/helper";

type product = {
  id: string;
  title: string;
  thumbnail: string;
  totalPrice: number;
  price: number;
  qty: number;
};

export interface Orders {
  id: any;
  products: product[];
  paymentStatus: string;
  date: string;
  total: number;
  deliveryStatus: "ordered" | "delivered" | "shipped";
}

export default function OrderListPublic({ orders }: { orders: Orders[] }) {
  if (orders.length === 0) {
    return (
      <div className="animate-pulse text-5xl text-center text-gray-500 p-10 m-auto font-semibold">
        Order something!
      </div>
    );
  }
  return (
    <div>
      {orders.map((order) => {
        return (
          <div key={order.id} className="py-4 space-y-4">
            <div className="flex justify-between items-center blue-gray-400 text-white p-2">
              <p>Ordered Date : {dateFormat(order.date, "dd / mm / yyyy")}</p>
              <p>Total : {formatPrice(order.total)}</p>
              <Chip value={order.paymentStatus} color="amber" />
            </div>

            {order.products.map((p) => {
              return (
                <div key={p.id} className="flex space-x-2">
                  <Image
                    src={p.thumbnail}
                    width={50}
                    height={50}
                    alt={p.title}
                  />
                  <div>
                    <p>{p.title}</p>
                    <div className="flex space-x-2 text-sm">
                      <p>{p.qty}</p>
                      <p>x</p>
                      <p>{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="text-right p-2 border-t border-b">
              <p>
                Order Status:{" "}
                <span className="font-semibold uppercase ">
                  {order.deliveryStatus}
                </span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
