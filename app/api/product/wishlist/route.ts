import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import WishlistModel from "@/app/models/wishlistModel";

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: "unauthorized request!" },
      { status: 403 }
    );
  }

  const { productId } = await req.json();
  if (!isValidObjectId(productId)) {
    return NextResponse.json({ error: "Invalid Product Id!" }, { status: 422 });
  }

  const wishlist = await WishlistModel.findOne({
    user: session.user.id,
    products: productId,
  });

  if (wishlist) {
    await WishlistModel.findByIdAndUpdate(wishlist._id, {
      $pull: { products: productId },
    });
  } else {
    await WishlistModel.findOneAndUpdate(
      {
        user: session.user.id,
      },
      {
        user: session.user.id,
        $push: { products: productId },
      },
      {
        upsert: true,
      }
    );
  }

  return NextResponse.json({ success: true });
};
