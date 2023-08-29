"use client";
import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import { uploadImage } from "@/app/utils/helper";
import { newProductInfoSchema } from "@/app/utils/validationSchema";
import React from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";
import { createProduct } from "../action";
export default function Create() {
  const handleCreateProduct = async (values: NewProductInfo) => {
    const { thumbnail, images } = values;
    try {
      await newProductInfoSchema.validate(values, { abortEarly: false });

      const thumbnailRes = await uploadImage(thumbnail!);

      let productImages: { url: string; id: string }[] = [];

      if (images) {
        const uploadPromise = images.map(async (image) => {
          const { id, url } = await uploadImage(image);
          return { id, url };
        });
        productImages = await Promise.all(uploadPromise);
      }

      await createProduct({
        ...values,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
        thumbnail: thumbnailRes,
        images: productImages,
      });
      console.log(values.title, " added ");
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => toast.error(err.message));
      }
    }
  };
  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
