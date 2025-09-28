// src/components/Product/Product.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import classes from "./product.module.css";
import Loader from "../Loader/Loader"; // Correct import for default export

function Product() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true); // Start loading before API request
    axios
      .get("https://fakestoreapi.com/products/")
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className={classes.products_container}>
          {products.map((singleProduct) => {
         return <ProductCard
              product={singleProduct}
              key={singleProduct.id}
              renderAdd={true}
            />
})}
        </section>
      )}
    </>
  );
}

export default Product;
