import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "./SearchBar";
import "./Navbar.css";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Music Log
      </Link>

      <SearchBar />

      <div className="navbar-user" ref={dropdownRef}>
        <button
          className="profile-button"
          onClick={() => setOpen(!open)}
        >
          <FaUserCircle />

          <span>{user?.username}</span>

          <FaChevronDown
            className={open ? "rotate" : ""}
          />
        </button>

        {open && (
          <div className="dropdown-menu">
            <div>{user?.email}</div>

            <hr />
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
            >
              My Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>

            <hr />

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}