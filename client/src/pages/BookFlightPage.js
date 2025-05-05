import React, { useState } from 'react';
import axios from 'axios';

function BookFlightPage() {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyBooking = async () => {
    setError('');
    setMessage('');
    try {
      const res = await axios.get(`/api/bookings/by-code/${confirmationCode}`);
      setBooking(res.data.booking);
      const flightRes = await axios.get(`/api/flights/by-trip/${res.data.booking.trip_id}`);
      setFlights(flightRes.data);
    } catch (err) {
      setBooking(null);
      setFlights([]);
      setError('Invalid confirmation code or no booking found.');
    }
  };

  const handleBookFlight = async () => {
    if (!selectedFlight || !booking) return;
    try {
      await axios.post('/api/booking-flight', {
        bookingId: booking.booking_id,
        flightId: selectedFlight
      });
      setMessage('✅ Flight booked successfully!');
    } catch (err) {
      setMessage(`❌ Booking failed: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Book a Flight</h3>

      <div className="mb-3">
        <label>Enter Confirmation Code:</label>
        <input className="form-control"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleVerifyBooking}>
          Verify & Show Flights
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      {booking && (
        <>
          <div className="alert alert-success">
            Booking verified for <strong>{booking.trip_name}</strong> ({booking.start_date} to {booking.end_date})
          </div>

          <h5>Available Flights</h5>
          {flights.length === 0 ? (
            <p>No flights available for this trip.</p>
          ) : (
            <ul className="list-group">
              {flights.map(flight => (
                <li key={flight.flight_id}
                    className={`list-group-item ${selectedFlight === flight.flight_id ? 'active' : ''}`}
                    onClick={() => setSelectedFlight(flight.flight_id)}
                    style={{ cursor: 'pointer' }}>
                  ✈ <strong>{flight.airline_name}</strong> • {flight.departure_airport} ➜ {flight.arrival_airport} • ${flight.price}
                </li>
              ))}
            </ul>
          )}

          <button
            className="btn btn-success mt-3"
            disabled={!selectedFlight}
            onClick={handleBookFlight}>
            Confirm Flight
          </button>
        </>
      )}
    </div>
  );
}

export default BookFlightPage;