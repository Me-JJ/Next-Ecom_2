import Image from "next/image";
import startDb from "../lib/db";
import ProductModel from "../models/productModel";
import GridView from "../components/GridView";
import ProductCard from "../components/ProductCard";
import FeaturedProductsSlider from "../components/FeatureProductSlider";
import FeaturedProductModel from "../models/featuredProducts";
import HorizontalMenu from "../components/HorizontalMenu";

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

const fetFeaturedProducts = async () => {
  await startDb();
  const products = await FeaturedProductModel.find().sort("-createdAt");

  return products.map((product) => {
    return {
      id: product.id.toString(),
      title: product.title,
      link: product.link,
      linkTitle: product.linkTitle,
      banner: product.banner.url,
    };
  });
};

export default async function Home() {
  const latestProducts = await fetLatestProducts();
  const parsedProducts = JSON.parse(latestProducts) as latestProducts[];
  const featuredProducts = await fetFeaturedProducts();
  return (
    <div className="space-y-4">
      <FeaturedProductsSlider products={featuredProducts} />
      <HorizontalMenu />
      <GridView>
        {parsedProducts.map((product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </GridView>
    </div>
  );
}
