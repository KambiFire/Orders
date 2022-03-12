import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import { useEffect, useState } from "react";

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places
// You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  update
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount || 0}</td>
      <td>{price ? "$" + price.toFixed(2) : ""}</td>
      <td>{orderedQuantity || ""}</td>
      <td>{total ? "$" + total.toFixed(2) : ""}</td>
      <td>
        <button
          className={styles.actionButton}
          disabled={availableCount < 1 || orderedQuantity >= availableCount}
          onClick={() => update(id, ++orderedQuantity || 1)}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          disabled={!orderedQuantity}
          onClick={() => update(id, --orderedQuantity || 0)}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [products, setproducts] = useState([]);
  const [totals, setTotals] = useState({ total: 0, discount: 0 });

  const fetchProducts = async () => setproducts(await getProducts());

  useEffect(() => {
    fetchProducts();
    return () => {
      setproducts([]);
      setTotals({ total: 0, discount: 0 });
    };
  }, []);

  const updateProduct = (id, quantity) => {
    const prodIndex = products.findIndex((product) => product.id === id);
    if (prodIndex !== -1) {
      products[prodIndex]["orderedQuantity"] = quantity;
      products[prodIndex]["total"] = products[prodIndex].price * quantity;
      getTotals();
    } else console.log("Not found");
  };

  const getTotals = () => {
    const total = products.reduce((sum, curr) => (sum += curr.total || 0), 0);
    if (total > 1000) setTotals({ total: total * 0.9, discount: total * 0.1 });
    else setTotals({ total: total, discount: 0 });
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Orders</h1>
      </header>
      <main>
        {products?.length < 1 && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <Product key={index} {...product} update={updateProduct} />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        {totals?.discount > 0 && (
          <p>Discount: ${totals?.discount.toFixed(2)}</p>
        )}
        <p>Total: ${totals?.total.toFixed(2)} </p>
      </main>
    </div>
  );
};

export default Checkout;
