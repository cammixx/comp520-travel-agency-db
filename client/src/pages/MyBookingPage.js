import React, { useState } from 'react';
import BookingLookupForm from '../components/BookingLookupForm';

function MyBookingPage() {
  const [booking, setBooking] = useState(null);

  const handleLookup = (code) => {
    console.log('Looking up booking for code:', code);
    // Mocked result
    setBooking({
      trip_name: 'European Adventure',
      status: 'Confirmed',
      start_date: '2025-06-01',
      end_date: '2025-06-10'
    });
  };

  return (
    <div className="container mt-4">
      <h2>My Booking</h2>
      <BookingLookupForm onLookup={handleLookup} />
      {booking && (
        <div className="mt-4 p-3 border bg-light rounded">
          <h4>Booking Info</h4>
          <p><strong>Trip:</strong> {booking.trip_name}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          <p><strong>Dates:</strong> {booking.start_date} to {booking.end_date}</p>
        </div>
      )}
    </div>
  );
}

export default MyBookingPage;