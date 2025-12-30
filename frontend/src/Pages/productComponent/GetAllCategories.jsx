import { useEffect, useState } from "react";
import axios from "axios";
import CategoryRow from "./CategoryRow";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:8080/api/category/all");
    setCategories(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/category/${id}`);
    fetchCategories(); // refresh list
  };

  const handleEdit = (category) => {
    console.log("Edit category:", category);
    // you can open a modal here to edit
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      {categories.map((cat) => (
        <CategoryRow
          key={cat.id}
          category={cat}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default AdminCategories;
