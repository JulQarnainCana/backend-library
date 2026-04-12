import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

function navCls({ isActive }) {
  return `sidebar-nav-link${isActive ? " is-active" : ""}`;
}

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <h2>📚 LiteX</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/catalog" className={navCls}>
              Catalog
            </NavLink>
          </li>
          <li>
            <NavLink to="/books" className={navCls}>
              Books
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservations" className={navCls}>
              Reservation
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-loans" className={navCls}>
              MyLoans
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className={navCls}>
              History
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-account" className={navCls}>
              My Account
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <Link to="/admin" className="sidebar-nav-link subtle">
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
}
