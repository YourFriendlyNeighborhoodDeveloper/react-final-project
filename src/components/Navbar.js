import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          MovieFinder
        </Link>

        <Link to="/" className="nav-link">
          Browse Movies
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;