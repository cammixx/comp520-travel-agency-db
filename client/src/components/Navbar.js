import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-dark" to="/">Find your next trip</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/">Trips</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/book">Book</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/my-booking">My Booking</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/rate">Rate Trip</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;