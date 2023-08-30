import FeaturedProductForm from "@/app/components/FeaturedProductForm";
import startDb from "@/app/lib/db";
import FeaturedProductModel from "@/app/models/featuredProducts";
import { isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: { id: string };
}

const fetchFeatureProduct = async (id: string) => {
  if (!isValidObjectId(id)) {
    console.log(id);
    return redirect("/404");
  }

  await startDb();
  const product = await FeaturedProductModel.findById(id);
  if (!product) {
    return redirect("/404");
  }

  const { _id, title, banner, link, linkTitle } = product;

  return {
    id: _id.toString(),
    title,
    banner: banner.url,
    link,
    linkTitle,
  };
};

export default async function UpdateFeaturedProduct({ searchParams }: Props) {
  const { id } = searchParams;
  const product = await fetchFeatureProduct(id);
  return <FeaturedProductForm initialValue={product} />;
}
