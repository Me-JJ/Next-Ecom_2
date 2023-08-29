import Image from "next/image";
import startDb from "../lib/db";
import ProductModel from "../models/productModel";
import GridView from "../components/GridView";
import ProductCard from "../components/ProductCard";

interface latestProducts {
  id: any;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: {
    base: number;
    discounted: number;
  };
  sale: number;
}

const fetLatestProducts = async () => {
  await startDb();
  const products = await ProductModel.find().sort("-createdAt").limit(20);

  const productList = products.map((product) => {
    return {
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
    };
  });

  return JSON.stringify(productList);
};
export default async function Home() {
  const latestProducts = await fetLatestProducts();
  const parsedProducts = JSON.parse(latestProducts) as latestProducts[];
  return (
    <GridView>
      {parsedProducts.map((product) => {
        return <ProductCard product={product} key={product.id} />;
      })}
    </GridView>
  );
}
