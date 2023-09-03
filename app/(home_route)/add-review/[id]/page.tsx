import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReviewForm from "@/app/components/ReviewForm";
import ReviewModel from "@/app/models/reviewModel";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import startDb from "@/app/lib/db";

interface Props {
  params: { id: string };
}
const fetchReview = async (productId: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    // toast.warn("Login to your account to add reviews.");
    return redirect("/auth/signin");
  }

  await startDb();
  const review = await ReviewModel.findOne({
    userId: session.user.id,
    product: productId,
  }).populate<{ product: { title: string; thumbnail: { url: string } } }>({
    path: "product",
    select: "title thumbnail.url",
  });

  if (review) {
    return {
      id: review._id.toString(),
      rating: review.rating,
      comment: review.comment,
      product: {
        title: review.product.title,
        thumbnail: review.product.thumbnail.url,
      },
    };
  }
};
export default async function Review({ params }: Props) {
  const productId = params.id;

  const review = await fetchReview(productId);

  const initialValue = review
    ? { comment: review.comment || "", rating: review.rating }
    : undefined;
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <Image
          src={review?.product.thumbnail || ""}
          alt={review?.product.title || "thumbnail"}
          width={50}
          height={50}
          className="rounded"
        />
        <h3 className="font-semibold">{review?.product.title}</h3>
      </div>
      <ReviewForm productId={productId} initialValue={initialValue} />
    </div>
  );
}
