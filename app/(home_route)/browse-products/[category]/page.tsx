import Image from "next/image";
import startDb from "../../../lib/db";
import ProductModel from "../../../models/productModel";
import GridView from "../../../components/GridView";
import ProductCard from "../../../components/ProductCard";
import FeaturedProductsSlider from "../../../components/FeatureProductSlider";
import FeaturedProductModel from "../../../models/featuredProducts";
import HorizontalMenu from "../../../components/HorizontalMenu";

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

const fetchProductsByCategory = async (category: string) => {
  await startDb();
  const products = await ProductModel.find({ category })
    .sort("-createdAt")
    .limit(20);

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

interface Props {
  params: { category: string };
}
export default async function ProductByCategory({ params }: Props) {
  const products = await fetchProductsByCategory(
    decodeURIComponent(params.category)
  );
  const parsedProducts = JSON.parse(products) as latestProducts[];
  return (
    <div className="space-y-4">
      <HorizontalMenu />
      {parsedProducts.length ? (
        <GridView>
          {parsedProducts.map((product) => {
            return <ProductCard product={product} key={product.id} />;
          })}
        </GridView>
      ) : (
        <h1 className="text-center pt-10 font-semibold text-2xl opacity-40">
          Sorry there are no products in this category
        </h1>
      )}
    </div>
  );
}
