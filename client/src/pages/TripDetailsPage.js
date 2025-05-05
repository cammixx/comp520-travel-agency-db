import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock trip data (could also import from mock file)
const mockTrips = [
  {
    trip_id: 1,
    trip_name: 'European Adventure',
    trip_type: 'Cultural',
    duration: 10,
    base_price: 1200.00,
    description: 'Explore iconic cities across Europe.',
    ratings: [
      { rating_score: 5, feedback: 'Best trip ever!', customer_name: 'Alice' },
      { rating_score: 4, feedback: 'Great value for the price.', customer_name: 'Bob' }
    ]
  },
  {
    trip_id: 2,
    trip_name: 'Tropical Escape',
    trip_type: 'Relaxation',
    duration: 7,
    base_price: 950.00,
    description: 'Relax on sunny beaches with clear blue waters.',
    ratings: [
      { rating_score: 4, feedback: 'Beautiful scenery and great hotel.', customer_name: 'Charlie' }
    ]
  }
];

function TripDetailsPage() {
  const { id } = useParams();
  const trip = mockTrips.find(t => t.trip_id === parseInt(id));

  if (!trip) {
    return (
      <div className="container mt-4">
        <h2>Trip not found</h2>
        <Link to="/" className="btn btn-outline-secondary mt-3">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-primary">{trip.trip_name}</h2>
      <p><strong>Type:</strong> {trip.trip_type}</p>
      <p><strong>Duration:</strong> {trip.duration} days</p>
      <p><strong>Price:</strong> ${trip.base_price}</p>
      <p><strong>Description:</strong> {trip.description}</p>

      <h4 className="mt-4">Customer Reviews</h4>
      {trip.ratings.length > 0 ? (
        <ul className="list-group">
          {trip.ratings.map((r, i) => (
            <li key={i} className="list-group-item">
              <strong>{r.customer_name}</strong> — ⭐ {r.rating_score} <br />
              <span>{r.feedback}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      <Link to="/" className="btn btn-outline-success mt-4">Back to Trips</Link>
    </div>
  );
}

export default TripDetailsPage;