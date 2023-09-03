import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ReviewRequestBody } from "@/app/types";
import { Types, isValidObjectId } from "mongoose";
import startDb from "@/app/lib/db";
import ReviewModel from "@/app/models/reviewModel";
import ProductModel from "@/app/models/productModel";

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "unauthorized request!" },
        { status: 401 }
      );
    }

    const { productId, comment, rating } =
      (await req.json()) as ReviewRequestBody;

    if (!isValidObjectId(productId)) {
      return NextResponse.json(
        { error: "PRODUCT NOT FOUND!" },
        { status: 401 }
      );
    }

    if (rating <= 0 || rating > 5) {
      return NextResponse.json(
        { error: "can't predict the rating!" },
        { status: 401 }
      );
    }

    await startDb();
    const userId = session.user.id;

    const data = {
      userId,
      rating,
      comment,
      product: productId,
    };

    await ReviewModel.findOneAndUpdate({ userId, product: productId }, data, {
      upsert: true,
    });

    await updateProductRating(productId);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong, could not update review!" },
      { status: 500 }
    );
  }
};

const updateProductRating = async (productId: string) => {
  const [result] = await ReviewModel.aggregate([
    { $match: { product: new Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  if (result?.averageRating) {
    await ProductModel.findByIdAndUpdate(productId, {
      rating: result.averageRating,
    });
  }
};
