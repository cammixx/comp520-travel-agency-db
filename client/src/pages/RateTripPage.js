import React from 'react';
import RatingForm from '../components/RatingForm';


function RateTripPage() {
  const handleSubmitRating = async ({ code, score, feedback }) => {
    try {
      const res = await fetch(`http://localhost:5050/api/bookings/by-code/${code}`);
      
      if (!res.ok) {
        const text = await res.text(); // read raw response
        throw new Error(`Invalid confirmation code: ${text}`);
      }
  
      const booking = await res.json();
      const ratingRes = await fetch('http://localhost:5050/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: booking.booking.customer_id,
          bookingId: booking.booking.booking_id,
          ratingScore: parseInt(score),
          feedback,
        }),
      });
  
      if (!ratingRes.ok) {
        const text = await ratingRes.text();
        throw new Error(`Failed to submit rating: ${text}`);
      }
  
      alert('Feed back submitted successfully!');
    } catch (err) {
      alert(`${err.message}`);
    }
  };


  return (
    <div className="container mt-4">
      <h2>Rate Your Trip</h2>
      <RatingForm onSubmit={handleSubmitRating} />
    </div>
  );
}


export default RateTripPage;
