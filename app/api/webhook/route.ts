import CartItems from "@/app/components/CartItems";
import { getCartItems } from "@/app/lib/CartHelper";
import CartModel from "@/app/models/cartModel";
import OrderModel from "@/app/models/orderModel";
import ProductModel from "@/app/models/productModel";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-08-16",
});

export const POST = async (req: Request) => {
  const data = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(data, signature, webhookSecret);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      {
        status: 400,
      }
    );
  }
  // console.log("------->", event.type);
  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object as {
      customer: string;
      payment_intent: string;
      amount_subtotal: number;
      customer_details: any;
      payment_status: string;
    };
    const customer = (await stripe.customers.retrieve(
      stripeSession.customer
    )) as unknown as {
      metadata: {
        userId: string;
        cartId: string;
        type: "checkout";
      };
    };
    const { cartId, userId, type } = customer.metadata;

    if (type === "checkout") {
      const cartItems = await getCartItems(userId, cartId);
      OrderModel.create({
        userId,
        stripeCustomerId: stripeSession.customer,
        paymentIntent: stripeSession.payment_intent,
        totalAmount: stripeSession.amount_subtotal / 100,
        shippingDetails: {
          address: stripeSession.customer_details.address,
          email: stripeSession.customer_details.email,
          name: stripeSession.customer_details.name,
        },
        paymentStatus: stripeSession.payment_status,
        deliveryStatus: "ordered",
        orderItems: cartItems.products,
      });

      //recount our stock
      const updateProductPromises = cartItems.products.map(async (product) => {
        return await ProductModel.findByIdAndUpdate(product.id, {
          $inc: { quantity: -product.qty },
        });
      });

      await Promise.all(updateProductPromises);

      await CartModel.findByIdAndDelete(cartId);
    }
  }

  return NextResponse.json({ received: true });
};