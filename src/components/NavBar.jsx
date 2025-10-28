import { Link, Outlet } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Log In</Link>
        <Link to="/register">Register</Link>
        <Link to="/create-fundraiser">Create Fundraiser</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default NavBar;