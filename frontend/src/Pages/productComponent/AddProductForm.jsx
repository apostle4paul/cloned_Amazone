import { useState, useEffect } from "react";
import axios from "axios";

const AddProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/category/all");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle input change
  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedPhoto(e.target.files[0]);
    }
  };

  // Save product
  const saveProduct = async (e) => {
    e.preventDefault();

    // Validate
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.quantity ||
      !product.categoryId ||
      !selectedPhoto
    ) {
      alert("Please fill all fields");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("categoryId", product.categoryId);
    formData.append("image", selectedPhoto); // Must match DTO exactly

    try {
      const res = await axios.post(
        "http://localhost:8081/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product added successfully!");

      // Reset form
      setProduct({
        title: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
      });
      setSelectedPhoto(null);
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err.message);
      alert("Error saving product: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="container mt-3">
      <form onSubmit={saveProduct}>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={product.title}
          onChange={handleInput}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleInput}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleInput}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleInput}
          required
        />
        <select
          name="categoryId"
          value={product.categoryId}
          onChange={handleInput}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.title}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={handleFileChange} // use dedicated file handler
          accept="image/*"
          required
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
