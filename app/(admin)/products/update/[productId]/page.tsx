import UpdateProduct from "@/app/components/UpdateProduct";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { ProductResponse } from "@/app/types";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

interface props {
  params: {
    productId: string;
  };
}

const fetchProductInfo = async (
  productId: string
): Promise<ProductResponse> => {
  if (!isValidObjectId(productId)) return redirect("/404");

  await startDb();
  const product = await ProductModel.findById(productId).lean();
  if (!product) return redirect("/404");

  return {
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    thumbnail: product.thumbnail,
    price: product.price,
    bulletPoints: product.bulletPoints,
    images: product.images?.map(({ url, id }) => ({ url, id })),
    category: product.category,
    quantity: product.quantity,
  };
};
export default async function UpdatePage(props: props) {
  const { productId } = props.params;
  const product = await fetchProductInfo(productId);
  //   console.log(product);
  return <UpdateProduct product={product} />;
}
