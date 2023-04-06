import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" href="/">
        Inventory Manager
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" href="/">
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="sale">
              Sale
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="history">
              History
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
