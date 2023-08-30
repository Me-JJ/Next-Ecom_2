import startDb from "@/app/lib/db";
import CartModel from "@/app/models/cartModel";
import { NewCartRequest } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    // console.log("session product route-->", session);
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { error: "unauthorized access" },
        { status: 401 }
      );
    }
    const { productId, quantity } = (await req.json()) as NewCartRequest;

    // console.log("prod,quat", productId, quantity);
    if (!isValidObjectId(productId) || isNaN(quantity))
      return NextResponse.json({ error: "Invalid Request!" }, { status: 401 });

    await startDb();

    const cart = await CartModel.findOne({ userId: user.id });
    if (!cart) {
      //creating new cart if no cart
      await CartModel.create({
        userId: user.id,
        items: [{ productId, quantity }],
      });

      return NextResponse.json({ success: true });
    }
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      //update quantity if item already exists
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        //remove cart item if quantify is 0
        //cart.items = new cart items
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      }
    } else {
      //add new item if it dont exist
      cart.items.push({ productId: productId as any, quantity });
    }

    await cart.save();
    return NextResponse.json({ success: true });
    //remove item if quantity becomes zero

    //add new item if it does't exists
  } catch (error) {
    console.log("product cart route->", error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
};
