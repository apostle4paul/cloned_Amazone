import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./AdminAllProducts.module.css";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/product/all"
    );
    setProducts(response.data);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(
      `http://localhost:8080/api/product/delete/${id}`
    );

    getAllProducts(); // refresh list
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <div>
      <h2>All Products</h2>

      <table className={classes.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img
                  src={`http://localhost:8080/api/product/${p.imageName}`}
                  alt={p.title}
                  width="60"
                />
              </td>
              <td>{p.title}</td>
              <td>₹{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button onClick={() => deleteProduct(p.id)}>
                   Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllProducts;
