import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import startDb from "@/app/lib/db";
import OrderModel from "@/app/models/orderModel";

const validStatus = ["delivered", "ordered", "shipped"];

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (user?.role !== "admin")
    return NextResponse.json(
      { error: "unauthorized request!" },
      { status: 401 }
    );

  const { orderId, deliveryStatus } = await req.json();

  if (!isValidObjectId(orderId) || !validStatus.includes(deliveryStatus))
    return NextResponse.json({ error: "Invalid data!" }, { status: 401 });

  await startDb();

  await OrderModel.findByIdAndUpdate(orderId, { deliveryStatus });

  return NextResponse.json({ success: true });
};
