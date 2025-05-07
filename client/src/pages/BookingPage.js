import React from 'react';
import { useLocation } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { createBooking } from '../api/tripApi';

function BookingPage() {
  const query = new URLSearchParams(useLocation().search);
  const tripIdFromUrl = query.get('tripId');

  const handleSubmit = async (data) => {
    try {
      const result = await createBooking(data);
      if (result.success) {
        alert(`Booking confirmed! Please keep your confirmation code: ${result.confirmationCode}`);
      } else {
        alert(`Booking failed: ${result.message || result.error || 'An unexpected error occurred.'}`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || 'An unexpected error occurred.';
      alert(`Booking failed: ${errorMessage}`);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Book Your Trip</h2>
      <BookingForm onSubmit={handleSubmit} preselectedTripId={tripIdFromUrl} />
    </div>
  );
}

export default BookingPage;