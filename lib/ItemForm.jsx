export default function ItemForm({ refreshHook }) {
  async function onFormSubmit(event) {
    event.preventDefault();
    try {
      const form = new FormData(event.target);
      const data = Object.fromEntries(form.entries());
      const res = await fetch("/api/item", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = await res.json();
      alert("Uploaded");
      refreshHook();
      event.target.reset();
    } catch (error) {
      alert("Some Error Occured");
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="d-flex flex-wrap">
      <div className="form-group col-lg-6">
        <label>Name</label>
        <input
          className="form-control"
          type="text"
          name="name"
          placeholder="Name"
          required
        />
      </div>
      <div className="form-group col-lg-6">
        <label>Brand</label>
        <input
          className="form-control"
          type="text"
          name="brand"
          placeholder="Brand"
          required
        />
      </div>
      <div className="form-group col-lg-6">
        <label>Stock</label>
        <input
          className="form-control"
          type="number"
          name="stock"
          placeholder="Stock"
          required
        />
      </div>
      <div className="form-group col-lg-6">
        <label>Price</label>
        <input
          className="form-control"
          type="number"
          name="price"
          required
          placeholder="Price"
        />
      </div>
      <div className="form-group col-12">
        <label>Description</label>
        <input
          className="form-control"
          type="text"
          name="desc"
          placeholder="Description"
        />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-sm btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}
