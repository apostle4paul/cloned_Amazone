

const CategoryRow = ({ category, onEdit, onDelete }) => {
  return (
    <div className="admin-category-row">
      <span>{category.title}</span>
      <button onClick={() => onEdit(category)}>Edit</button>
      <button onClick={() => onDelete(category.id)}>Delete</button>
    </div>
  );
};

export default CategoryRow;
