import { useState } from "react";
import classes from "./AddCategoryForm.module.css";

const AddCategoryForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const saveCategory = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    const data = { title, description };

    try {
      const response = await fetch("http://localhost:8080/api/category/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const savedCategory = await response.json();
        console.log("Saved category:", savedCategory);
        alert("Category added successfully");
        setTitle("");
        setDescription("");
      } else {
        const errorText = await response.text();
        console.error("Failed to add category:", errorText);
        alert("Failed to add category");
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <div className={classes.header}>
          <h3>Add Category</h3>
        </div>

        <div className={classes.body}>
          <form onSubmit={saveCategory}>
            <div className={classes.formGroup}>
              <label htmlFor="title">Category Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter category title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="description">Category Description</label>
              <textarea
                id="description"
                rows="3"
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className={classes.submitBtn}>
              Add Category
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;
