import React, { useState } from "react";
import "../App.css";
import { Link, NavLink } from "react-router-dom";
import { GiEgyptianBird } from "react-icons/gi";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container d-flex justify-content-between">
        <Link to="/" className="navbar-brand text-white">
          <div className="d-flex align-items-center">
            <GiEgyptianBird
              className="navbar-icon me-1"
              style={{ fontSize: "35px", fontWeight: "bold", color: "#a4d814" }}
            />
            <span
              className="character1"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              p
            </span>
            <span
              className="character2"
              style={{ fontSize: "20px", fontWeight: "bold", color: "#a4d814" }}
            >
              M
            </span>
            <span
              className="character3"
              style={{ fontSize: "20px", fontWeight: "bold" }}
            >
              s
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleMobileMenuClick}
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`collapse navbar-collapse ${mobileMenuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto fs-5 font-weight-bold ">
            <li className="nav-item ">
              <NavLink
                to="/"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/birds"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Birds
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/productions"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Production
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/sales"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Sales
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/employees"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Employees
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/purchases"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/mortality"
                className="nav-link text-white"
                onClick={closeMobileMenu}
              >
                Mortality
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
