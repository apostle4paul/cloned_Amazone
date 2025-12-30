import classes from "./AdminProductCard.module.css";

const AdminProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className={classes.card}>
      <img
        src={`http://localhost:8080/api/product/${product.imageName}`}
        alt={product.title}
        className={classes.image}
      />

      <div className={classes.info}>
        <h3>{product.title}</h3>
        <p><b>Category:</b> {product.category.title}</p>
        <p><b>Price:</b> ₹{product.price}</p>
        <p><b>Stock:</b> {product.quantity}</p>
      </div>

      <div className={classes.actions}>
        <button
          className={classes.editBtn}
          onClick={() => onEdit(product)}
        >
          Edit
        </button>

        <button
          className={classes.deleteBtn}
          onClick={() => onDelete(product.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;
