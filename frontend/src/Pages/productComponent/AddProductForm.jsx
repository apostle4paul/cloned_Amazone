import { useState, useEffect } from "react";
import axios from "axios";
import classes from "./AddProductForm.module.css";

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

  // ================= FETCH CATEGORIES =================
  const retrieveAllCategories = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/category/all"
    );
    return response.data;
  };

  useEffect(() => {
    const getAllCategories = async () => {
      const allCategories = await retrieveAllCategories();
      if (allCategories) {
        setCategories(allCategories);
      }
    };
    getAllCategories();
  }, []);

  // ================= INPUT HANDLER =================
  const handleInput = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ================= SAVE PRODUCT =================
  const saveProduct = async (e) => {
    e.preventDefault();

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

    const formData = new FormData();
    formData.append("image", selectedPhoto);
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("categoryId", product.categoryId);

    try {
      await axios.post(
        "http://localhost:8080/api/product/add",
        formData
      );
      alert("Product added successfully");

      // Reset form
      setProduct({
        title: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
      });
      setSelectedPhoto(null);
    } catch (error) {
      console.error(error);
      alert("Error saving product");
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <div className={classes.header}>
          <h3>Add Product</h3>
        </div>

        <div className={classes.body}>
          <form onSubmit={saveProduct}>
            <div className={classes.formGroup}>
              <label htmlFor="title">Product Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={product.title}
                onChange={handleInput}
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="description">Product Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={product.description}
                onChange={handleInput}
              />
            </div>

            <div className={classes.formGroup}>
              <label>Category</label>
              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleInput}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleInput}
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInput}
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="formFile">Product Image</label>
              <input
                type="file"
                id="formFile"
                onChange={(e) => setSelectedPhoto(e.target.files[0])}
              />
            </div>

            <button type="submit" className={classes.submitBtn}>
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
