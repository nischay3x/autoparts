import { useState } from "react";

export default function EditItemForm({ refreshHook, data }) {
  const [form, setForm] = useState({
    name: data?.name,
    brand: data?.brand,
    stock: data?.stock,
    price: data?.price,
    desc: data?.desc,
  });
  function onFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  async function onFormSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch("/api/item/" + data._id, {
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      });

      await res.json();
      alert("Updated!");
      refreshHook();
    } catch (error) {
      alert("Some Error Occured");
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="d-flex flex-wrap">
      <div className="form-group col-12">
        <label>Name</label>
        <input
          className="form-control"
          type="text"
          value={form.name}
          onChange={onFormChange}
          name="name"
          placeholder="Name"
        />
      </div>
      <div className="form-group col-12">
        <label>Brand</label>
        <input
          className="form-control"
          type="text"
          name="brand"
          value={form.brand}
          onChange={onFormChange}
          placeholder="Brand"
        />
      </div>
      <div className="form-group col-12">
        <label>Stock</label>
        <input
          className="form-control"
          type="number"
          name="stock"
          value={form.stock}
          onChange={onFormChange}
          placeholder="Stock"
        />
      </div>
      <div className="form-group  col-12">
        <label>Price</label>
        <input
          className="form-control"
          type="number"
          name="price"
          value={form.price}
          onChange={onFormChange}
          placeholder="Price"
        />
      </div>
      <div className="form-group col-12">
        <label>Description</label>
        <input
          className="form-control"
          type="text"
          name="desc"
          value={form.desc}
          onChange={onFormChange}
          placeholder="Description"
        />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-warning btn-sm">
          Submit
        </button>
      </div>
    </form>
  );
}
