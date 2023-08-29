import ProductTable, { Product } from "@/app/components/ProductTable";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import React from "react";

const fetchProducts = async (
  pageNo: number,
  perPage: number
): Promise<Product[]> => {
  const skipCount = (pageNo - 1) * perPage;

  await startDb();

  const products = await ProductModel.find()
    .sort("-createdAt")
    .skip(skipCount)
    .limit(perPage);

  return products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      description: product.description,
      price: {
        mrp: product.price.base,
        salePrice: product.price.discounted,
        saleOff: product.sale,
      },
      category: product.category,
      quantity: product.quantity,
    };
  });
};
export default async function Products() {
  const products = await fetchProducts(1, 10);

  return (
    <div>
      <ProductTable products={products} />
    </div>
  );
}
