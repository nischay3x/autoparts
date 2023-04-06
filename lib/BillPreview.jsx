export default function BillPreview({ cart = [], cartData }) {
  return (
    <div className="container-fluid py-2">
      <div className="d-flex align-items-center pr-3 justify-content-between">
        <h5>Bill Preview</h5>
        <button
          className="btn btn-sm btn-success"
          onClick={() => window.print()}
        >
          <i className="bi bi-printer" />
        </button>
      </div>
      <br />
      <div id="print-page">
        <div className="text-center">
          <h4 className="fw-600">Super Auto Parts</h4>
          <p className="fs-small">
            Near Navagarh Chowk, Kawardha Road <br />
            Bemetara - 491335
          </p>
        </div>
        <div className="px-1 fs-small border-bottom d-flex justify-content-between">
          <span>GSTIN / UIN: 22CEAPK7802L1ZM</span>
          <span className="text-right">Contact: 989-307-0629</span>
        </div>
        <div className="text-center py-1 fw-500">
          TAX INVOICE [{cartData.type}]
        </div>
        <div className="py-1 fs-small d-flex flex-wrap">
          <div className="col-6">
            <span className="fw-500">To: </span> {cartData.name}
          </div>
          <div className="col-6 text-right">
            <span className="fw-500">ID: </span> {cartData.id}
          </div>
          <div className="col-6">
            <span className="fw-500">Mobile: </span> {cartData.contact}
          </div>
          <div className="col-6 text-right">
            <span className="fw-500">Date: </span>{" "}
            {new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="pt-1">
          <table className="table-custom fs-small">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Item</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c, i) => (
                <tr key={i}>
                  <td scope="row">{i + 1}</td>
                  <td className="mw-40">{c.name}</td>
                  <td>&#8377; {c.price}</td>
                  <td>{c.quantity}</td>
                  <td>&#8377; {c.price * c.quantity}</td>
                </tr>
              ))}
              <tr className="border">
                <td scope="row"></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="fw-500">&#8377; {calculateTotal(cart)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function calculateTotal(items = []) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].quantity * items[i].price;
  }
  return total;
}
