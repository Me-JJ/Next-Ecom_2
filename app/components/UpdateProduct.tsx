"use client";
import React from "react";
import ProductForm, { InitialValue } from "./ProductForm";
import { ProductResponse } from "../types";
import { removeAndUpdateProductImage } from "../(admin)/products/action";

interface props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: props) {
  const initialValue: InitialValue = {
    ...product,
    thumbnail: product.thumbnail.url,
    images: product.images?.map(({ url }) => url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
    bulletPoints: product.bulletPoints || [],
  };

  const handleImageRemove = (source: string) => {
    // console.log("source->", source);
    // console.log(source.split("/"));

    const publicId = source.split("/").slice(-1)[0].split(".")[0]; // getting the public id from source

    removeAndUpdateProductImage(product.id, publicId);
  };
  return (
    <ProductForm
      onImageRemove={handleImageRemove}
      initialValue={initialValue}
      onSubmit={(values) => {
        console.log(values);
      }}
    />
  );
}
