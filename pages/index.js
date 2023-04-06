import Head from "next/head";
import ItemForm from "../lib/ItemForm";
import { useState, useEffect, useRef } from "react";
import useItemSearch from "../lib/useItemSearch";
import useIntersectionObserver from "../lib/useIntersectionObserver";
import EditItemForm from "../lib/EditItemForm";

async function getItems(...queries) {
  const res = await fetch(
    `/api/item?${Object.keys(queries)
      .map((k) => `${k}=${queries[k]}`)
      .join("&")}`
  );
  const data = await res.json();
  return { ...data };
}

export default function IndexPage() {
  const [query, setQuery] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [items, setItems] = useState([]);
  const [isLoading, data, error, hasMore] = useItemSearch(query, skip, limit);

  const nextLoadRef = useRef(null);
  const intersecting = useIntersectionObserver(nextLoadRef, { threshold: 0.5 });

  const [toEdit, setToEdit] = useState({});
  function onItemEdit(index) {
    setToEdit(items[index]);
  }

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

  return (
    <>
      <Head>
        <title>Product Catalouge</title>
      </Head>
      <div className="container-fluid py-2">
        <div className="card card-body mb-2">
          <h5 className="card-title">New Product</h5>
          <ItemForm refreshHook={refreshTable} />
        </div>
        <div className="card card-body">
          <div className="d-flex align-items-center pb-2 justify-content-between">
            <h5 className="card-title">Product Catalouge</h5>
            <input
              className="col-lg-3 form-control"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <ItemTable
            items={items}
            refreshTable={refreshTable}
            onItemEdit={onItemEdit}
          />
          {isLoading && <div className="loader"></div>}
          {error && (
            <div className="alert alert-danger" role="alert">
              Error while loading data!{" "}
              <i className="bi bi-emoji-frown-fill"></i>{" "}
            </div>
          )}
          <div ref={nextLoadRef}></div>
        </div>
      </div>
      <div className={`edit-tray ${toEdit?._id ? "active" : ""} `}>
        <div className="d-flex pt-2 col-12">
          <button
            className="btn btn-sm btn-outline-danger ml-auto"
            onClick={() => setToEdit({})}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {Boolean(toEdit?._id) && (
          <EditItemForm refreshHook={refreshTable} data={toEdit} />
        )}
      </div>
    </>
  );
}

function ItemTable({ items = [], refreshTable, onItemEdit }) {
  async function onItemDelete(id) {
    if (confirm("WARNING: This will be deleted forever.")) {
      try {
        const res = await fetch("/api/item/" + id, {
          method: "DELETE",
        });
        await res.json();
        alert("Item Deleted");
        refreshTable();
      } catch (error) {
        console.log(error);
        alert("An error occured");
      }
    }
  }

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Brand</th>
          <th scope="col">Stock</th>
          <th scope="col">Price</th>
          <th scope="col">Description</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((itm, idx) => (
          <tr key={idx}>
            <th scope="row">{idx + 1}</th>
            <td>{itm.name}</td>
            <td>{itm.brand}</td>
            <td>{itm.stock}</td>
            <td>{itm.price}</td>
            <td>{itm.desc}</td>
            <td>
              <button
                onClick={() => onItemEdit(idx)}
                className="btn btn-sm btn-warning"
                title="Edit"
              >
                <i className="bi bi-pencil" />
              </button>
              <button
                onClick={() => onItemDelete(itm._id)}
                className="ml-2 btn btn-sm btn-danger"
                title="Delete"
              >
                <i className="bi bi-trash" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
