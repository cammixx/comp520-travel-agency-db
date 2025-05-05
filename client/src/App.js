import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import TripDetailsPage from './pages/TripDetailsPage';
import BookingPage from './pages/BookingPage';
import BookFlightPage from './pages/BookFlightPage';
import BookHotelPage from './pages/BookHotelPage';
import RateTripPage from './pages/RateTripPage';
import BookingLookupForm from './components/BookingLookupForm';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'rgb(47, 166, 120)' }}>
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Travel Agency</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/book">Book a Trip</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/book-flight">Book Flight</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/book-hotel">Book Hotel</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/my-booking">Find My Booking</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/rate">Rate My Trip</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/trip/:id" element={<TripDetailsPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/book-flight" element={<BookFlightPage />} />
        <Route path="/book-hotel" element={<BookHotelPage />} />
        <Route path="/my-booking" element={<BookingLookupForm />} />
        <Route path="/rate" element={<RateTripPage />} />
      </Routes>
    </Router>
  );
}

export default App;