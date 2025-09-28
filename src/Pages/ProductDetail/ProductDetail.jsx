import { useEffect, useState } from "react";
import Layout from "../../components/LayOut/LayOut";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints";
import ProductCard from "../../components/Product/ProductCard";
import Loader from "../../components/Loader/Loader"; // Default import

function ProductDetail() {
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${productUrl}/products/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        product && (
          <ProductCard
            product={product}
            flex={true}
            renderDesc={true}
            renderAdd={true}
          />
        )
      )}
    </Layout>
  );
}

export default ProductDetail;
