import React, { useState } from 'react';
import { fetchBookingByConfirmation, cancelBookingByCode } from '../api/tripApi';

function formatMonthYear(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Pad month to 2 digits and get last 2 digits of year
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
}

function BookingLookupForm() {
  const [code, setCode] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [mockCard, setMockCard] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBooking(null);
    setCancelSuccess('');

    const result = await fetchBookingByConfirmation(code.trim());
    if (result.success) {
      setBooking(result.booking);
    } else {
      setError(result.error || 'Booking not found');
    }
  };

  const handleCancel = async () => {
    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    const result = await cancelBookingByCode(code.trim());
    if (result.success) {
      setCancelSuccess('Booking cancelled successfully.');
      setBooking({ ...booking, booking_status: 'Cancelled' });
    } else {
      setError(result.error || 'Failed to cancel booking.');
    }
  };

  const handlePayment = async () => {
    if (!mockCard.trim()) {
      alert('Enter a mock card number to proceed.');
      return;
    }

    const response = await fetch('http://localhost:5050/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: booking.booking_id
      })
    });

    const data = await response.json();
    if (data.success) {
      setBooking({ ...booking, booking_status: 'Completed' });
      alert('Payment successful. Booking completed.');
    } else {
      setError('Payment failed.');
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
        <label className="form-label">Enter your confirmation code:</label>
        <input
          type="text"
          className="form-control mb-2"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <label className="form-label mt-3">Enter Card Number (Mock):</label>
        <input
          type="text"
          className="form-control mb-2"
          value={mockCard}
          onChange={(e) => setMockCard(e.target.value)}
          placeholder="1234 5678 9012 3456"
        />
        <button type="submit" className="btn btn-primary">Find Booking</button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {cancelSuccess && <div className="alert alert-success mt-3">{cancelSuccess}</div>}

      {booking && (
          <div className="card p-3 shadow-sm mt-3">
            <h5 className="mb-2 text-success">{booking.trip_name}</h5>
            <p><strong>Confirmation Code:</strong> {booking.confirmation_code}</p>
            <p><strong>Type:</strong> {booking.trip_type}</p>
            <p>
              <strong>Dates:</strong>{' '}
              {new Date(booking.start_date).toLocaleDateString()} to {new Date(booking.end_date).toLocaleDateString()}
            </p>
            <p><strong>Total Price:</strong> ${booking.total_price}</p>
            {booking.total_spent !== undefined && (
              <p><strong>Remaining Balance:</strong> ${booking.total_spent}</p>
            )}
            <p><strong>Status:</strong> {booking.booking_status}</p>
            <button
              className="btn btn-danger mt-2"
              disabled={booking.booking_status === 'Cancelled'}
              onClick={handleCancel}
            >
              Cancel Booking
            </button>
            <button
              className="btn btn-success mt-2 ms-2"
              disabled={booking.booking_status !== 'Pending'}
              onClick={handlePayment}
            >
              Pay Now
            </button>
          </div>
        )}
    </div>
  );
}

export default BookingLookupForm;