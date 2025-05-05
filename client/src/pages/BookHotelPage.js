import React, { useState } from 'react';
import axios from 'axios';

function BookHotelPage() {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerifyBooking = async () => {
    setError('');
    setMessage('');
    try {
      const res = await axios.get(`/api/bookings/by-code/${confirmationCode}`);
      setBooking(res.data.booking);

      const hotelRes = await axios.get(`/api/hotels/by-trip/${res.data.booking.trip_id}`);
      setHotels(hotelRes.data);
    } catch (err) {
      setBooking(null);
      setHotels([]);
      setError('Invalid confirmation code or booking not found.');
    }
  };

  const handleBookHotel = async () => {
    if (!selectedHotel || !booking) return;
    try {
      await axios.post('/api/booking-hotel', {
        bookingId: booking.booking_id,
        hotelId: selectedHotel
      });
      setMessage('✅ Hotel booked successfully!');
    } catch (err) {
      setMessage(`❌ Booking failed: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Book a Hotel</h3>

      <div className="mb-3">
        <label>Enter Confirmation Code:</label>
        <input className="form-control"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleVerifyBooking}>
          Verify & Load Hotels
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-info">{message}</div>}

      {booking && (
        <>
          <div className="alert alert-success">
            Verified booking for <strong>{booking.trip_name}</strong> ({booking.start_date} to {booking.end_date})
          </div>

          <h5>Select a Hotel</h5>
          {hotels.length === 0 ? (
            <p>No hotels available for this trip.</p>
          ) : (
            <ul className="list-group">
              {hotels.map((h) => (
                <li key={h.hotel_id}
                    className={`list-group-item ${selectedHotel === h.hotel_id ? 'active' : ''}`}
                    onClick={() => setSelectedHotel(h.hotel_id)}
                    style={{ cursor: 'pointer' }}>
                  🏨 {h.name} ({h.city}, {h.country}) — ⭐ {h.star_rating}
                </li>
              ))}
            </ul>
          )}
          <button className="btn btn-success mt-3" disabled={!selectedHotel} onClick={handleBookHotel}>
            Confirm Hotel
          </button>
        </>
      )}
    </div>
  );
}

export default BookHotelPage;