import Head from "next/head";
import { useState } from "react";

export default function History() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [searchQueryObject, setSearchQueryObject] = useState({});

  async function getData(queryObject, append = false) {
    let query = new URLSearchParams(queryObject).toString();

    try {
      const res = await fetch("/api/sale?" + query, {
        method: "GET",
      });
      const resData = await res.json();

      if (append) {
        setItems((prev) => [...prev, ...resData.data]);
      } else {
        setItems(resData.data);
      }

      if (!queryObject.id) {
        setSearchQueryObject(queryObject);
        setHasMore(resData.totalDocs !== resData.data.length + items.length);
      } else {
        setSearchQueryObject({});
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      setItems([]);
      setHasMore(false);
    }
  }

  function onFormSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());
    getData(data);
  }

  function onLoadMore() {
    getData({ ...searchQueryObject, skip: items.length }, true);
  }

  const [toEdit, setToEdit] = useState({});
  const [editIndex, setEditIndex] = useState();
  function onItemEdit(index) {
    setEditIndex(index);
    setToEdit(items[index]);
  }

  async function onMakePaid(id) {
    try {
      const res = await fetch("/api/sale/" + id, {
        method: "PATCH",
        body: JSON.stringify({ paid: true }),
      });
      await res.json();
      alert("Updated");
      setToEdit({});
      setItems((prev) =>
        prev.map((p, idx) => {
          if (idx === editIndex) return { ...p, paid: true };
          return p;
        })
      );
      setEditIndex();
    } catch (error) {
      console.log(error);
      alert("Oops! an error occured!");
    }
  }

  return (
    <>
      <Head>
        <title>Sale History</title>
      </Head>
      <div className="container-fluid">
        <div className="card card-body">
          <form className="d-flex flex-wrap" onSubmit={onFormSubmit}>
            <div className="form-group col-1">
              <label className="form-label">Id</label>
              <input
                placeholder="Id"
                className="form-control"
                type="string"
                name="id"
              />
            </div>
            <div className="form-group col-5">
              <label className="form-label">Contact</label>
              <input
                placeholder="Search by Contact"
                className="form-control"
                type="tel"
                name="contact"
              />
            </div>
            <div className="form-group col-3">
              <label className="form-label">Payment Type</label>
              <select className="form-control" name="type" defaultValue="">
                <option value="">Select</option>
                <option value="CASH">Cash</option>
                <option value="CREDIT">Credit</option>
              </select>
            </div>
            <div className="form-group col-3">
              <label className="form-label">Status</label>
              <select className="form-control" name="paid" defaultValue="">
                <option value="">Select</option>
                <option value="true">Paid</option>
                <option value="false">Unpaid</option>
              </select>
            </div>
            <div className="form-group col-3">
              <label className="form-label">From Date</label>
              <input type="date" name="from" className="form-control" />
            </div>
            <div className="form-group col-3">
              <label className="form-label">To Date</label>
              <input type="date" name="to" className="form-control" />
            </div>
            <div className="form-group col d-flex px-3">
              <button type="submit" className="btn ml-auto mt-auto btn-warning">
                Search
              </button>
            </div>
          </form>
          <br />
          <table className="table table-striped fs-small">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Id</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Contact</th>
                <th scope="col">Item Count</th>
                <th scope="col">Amount</th>
                <th scope="col">Payment Type</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c, i) => (
                <tr key={i}>
                  <td className="fw-600" scope="row">
                    {i + 1}
                  </td>
                  <td className="mw-40">{c._id}</td>
                  <td>{c.name}</td>
                  <td>{c.contact}</td>
                  <td>{c.items.length}</td>
                  <td>&#8377; {c.total}</td>
                  <td>{c.type}</td>
                  <td>{c.paid ? "Paid" : "Unpaid"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => onItemEdit(i)}
                    >
                      <i className="bi bi-eye" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td scope="row"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="fw-600">
                  &#8377;{" "}
                  {items?.map((i) => i.total).reduce((a, b) => a + b, 0)}
                </td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          {hasMore && (
            <button onClick={onLoadMore} className="btn btn-sm btn-info">
              Load More
            </button>
          )}
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
        <br />
        {toEdit._id && (
          <div>
            <table className="table table-striped table-sm fs-small">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {toEdit.items.map((c, i) => (
                  <tr key={i}>
                    <td className="mw-40">{c.name}</td>
                    <td>&#8377; {c.price}</td>
                    <td>x {c.quantity}</td>
                    <td>&#8377; {c.price * c.quantity}</td>
                  </tr>
                ))}
                <tr className="fw-600">
                  <td />
                  <td />
                  <td />
                  <td>&#8377; {calculateTotal(toEdit.items)}</td>
                </tr>
              </tbody>
            </table>

            <div className="px-2">
              <p className="fs-small">
                Id: {toEdit._id}
                <br />
                Date: {new Date(toEdit.updatedAt).toLocaleDateString()}
              </p>
              {toEdit.type === "CREDIT" && !toEdit.paid && (
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onMakePaid(toEdit._id)}
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        )}
      </div>
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
