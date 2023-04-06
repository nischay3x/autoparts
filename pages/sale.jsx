import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import useItemSearch from "../lib/useItemSearch";
import useIntersectionObserver from "../lib/useIntersectionObserver";
import BillPreview from "../lib/BillPreview";

async function getItems(...queries) {
  const res = await fetch(
    `/api/item?${Object.keys(queries)
      .map((k) => `${k}=${queries[k]}`)
      .join("&")}`
  );
  const data = await res.json();
  return { ...data };
}

async function submitCart(data) {
  try {
    const res = await fetch("/api/sale", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();
    alert("Sold");
    return { ...resData, ...data };
  } catch (error) {
    console.log(error);
    alert("An error occured!");
    return null;
  }
}

async function updateSale(id, data) {
  try {
    const res = await fetch("/api/sale/" + id, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await res.json();
    alert("Updated");
    return { ...resData, ...data };
  } catch (error) {
    console.log(error);
    alert("An error occured!");
    return null;
  }
}

export default function SalePage() {
  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState([]);
  const [isLoading, data, error, hasMore] = useItemSearch(query, skip, limit);
  const [stockMap, setStockMap] = useState({});

  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(0);
  const [cartData, setCartData] = useState({});

  function onAddToCart(index) {
    const itemId = items[index]._id;
    setStockMap((prev) => ({ ...prev, [itemId]: items[index].stock }));
    if (cartItems.some((item) => item._id === itemId)) {
      setCartItems((prev) =>
        prev.map((item, idx) => {
          if (item._id === itemId)
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          return item;
        })
      );
    } else {
      setCartItems((prev) => [
        ...prev,
        {
          _id: itemId,
          name: items[index].name,
          brand: items[index].brand,
          price: items[index].price,
          quantity: 1,
        },
      ]);
    }
  }

  function onQuantityChange(event, index) {
    let value = parseInt(event.target.value);
    if (value <= 0) {
      setCartItems((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      setCartItems((prev) =>
        prev.map((itm, idx) => {
          if (idx === index)
            return {
              ...itm,
              quantity: value,
            };
          return itm;
        })
      );
    }
  }

  const nextLoadRef = useRef(null);
  const intersecting = useIntersectionObserver(nextLoadRef, { threshold: 0.5 });

  useEffect(() => {
    if (intersecting && hasMore) {
      setSkip((prev) => prev + limit);
    }
  }, [intersecting]);

  useEffect(() => {
    setItems(data.data);
  }, [data]);

  async function refreshTable() {
    const { data } = await getItems();
    setItems(data);
  }

  async function onCartSubmit(e) {
    e.preventDefault();
    if (!cartItems.length) {
      alert("Cart Empty!");
      return;
    }

    if (cartItems.some((itm) => itm.quantity > stockMap[itm._id])) {
      alert("Some Items are Out of Stock!");
      return;
    }

    const form = new FormData(e.target);
    const formData = Object.fromEntries(form.entries());
    let data = null;
    if (cartId) {
      data = await updateSale(cartId, {
        items: cartItems,
        total: calculateTotal(cartItems),
        ...formData,
      });
    } else {
      data = await submitCart({
        items: cartItems,
        total: calculateTotal(cartItems),
        ...formData,
      });
    }
    if (data?.id) {
      console.log(data);
      setCartId(data.id);
      setCartData(data);
      refreshTable();
    }
  }

  function onFormReset(e) {
    setCartItems([]);
    setCartId(0);
    setCartData({});
    e.target.reset();
  }

  return (
    <>
      <Head>
        <title>Sale</title>
      </Head>
      <div className="container-fluid py-2 d-flex flex-wrap">
        <div className="card card-body col-lg-8">
          <div className="d-flex align-items-center pb-2 justify-content-between">
            <h5 className="card-title">Products</h5>
            <input
              className="col-lg-3 form-control"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ItemTable items={items} addToCart={onAddToCart} />
          {!items?.length && !isLoading && (
            <div className="alert alert-info">No matches</div>
          )}
          {isLoading && <div className="loader"></div>}
          {error && (
            <div className="alert alert-danger" role="alert">
              Error while loading data!
              <i className="bi bi-emoji-frown-fill"></i>
            </div>
          )}
          <div ref={nextLoadRef}></div>
        </div>
        <div className="col-lg-4">
          <div className="card card-body">
            <h5 className="card-title">Cart</h5>
            <table className="fs-small">
              <tbody>
                {cartItems.map((c, i) => (
                  <tr key={i}>
                    <td className="mw-40">{c.name}</td>
                    <td>&#8377; {c.price}</td>
                    <td>
                      x{"  "}
                      <input
                        className="quantity-input"
                        value={c.quantity}
                        type="number"
                        onChange={(e) => onQuantityChange(e, i)}
                        min="0"
                        max={stockMap[c._id]}
                      />
                    </td>
                    <td>&#8377; {c.price * c.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <hr />
            <div className="d-flex justify-content-between pr-3">
              <span>Total</span>
              <span>&#8377; {calculateTotal(cartItems)}</span>
            </div>
            <form
              className="py-3"
              onSubmit={onCartSubmit}
              onReset={onFormReset}
            >
              <div className="form-group">
                <input
                  className="form-control"
                  required
                  type="text"
                  name="name"
                  placeholder="Customer Name"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  required
                  type="tel"
                  name="contact"
                  placeholder="Mobile (10 digit)"
                />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  name="type"
                  defaultValue="CASH"
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                </select>
              </div>
              <div className="form-group  justify-content-between d-flex">
                <button type="reset" className="btn btn-sm btn-warning">
                  Reset
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary ml-auto"
                >
                  {cartId ? "Edit" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {cartId && <BillPreview cart={cartItems} cartData={cartData} />}
    </>
  );
}

function calculateTotal(items = []) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].quantity * items[i].price;
  }
  return total;
}

function ItemTable({ items = [], addToCart }) {
  return (
    <>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Brand</th>
            <th scope="col">Stock</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((itm, idx) => (
            <tr key={idx}>
              <td>{itm.name}</td>
              <td>{itm.brand}</td>
              <td>{itm.stock}</td>
              <td>{itm.price}</td>
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => addToCart(idx)}
                >
                  Add to cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
