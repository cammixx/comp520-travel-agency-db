import React from 'react';
import RatingForm from '../components/RatingForm';

function RateTripPage() {
  const handleSubmitRating = (data) => {
    console.log('Rating submitted:', data);
    alert('Thank you for your feedback!');
  };

  return (
    <div className="container mt-4">
      <h2>Rate Your Trip</h2>
      <RatingForm onSubmit={handleSubmitRating} />
    </div>
  );
}

export default RateTripPage;