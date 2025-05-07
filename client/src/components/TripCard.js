import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TripCard({ trip, onBook }) {
  const [ratingDist, setRatingDist] = useState([]);
  const [showRatings, setShowRatings] = useState(false);
  const [allFeedback, setAllFeedback] = useState([]);

  // Fetch all customer ratings
  useEffect(() => {
    axios.get('http://localhost:5050/api/customers_ratings')
      .then((res) => {
        setAllFeedback(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch customer ratings:', err);
      });
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/trips/${trip.trip_id}/ratings`);
      setRatingDist(res.data);
      setShowRatings(true);
    } catch (err) {
      console.error('Failed to fetch rating distribution:', err);
    }
  };
  async function fetchTripAverageRating(tripId) {
    const response = await fetch(`http://localhost:5050/api/trips/${tripId}/average-rating`);
    const data = await response.json();
    return data.average_rating;
  }
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-success">{trip.trip_name}</h5>
        <p><strong>Type:</strong> {trip.trip_type && trip.trip_type !== 'N/A' ? trip.trip_type : 'Not specified'}</p>
        <p><strong>Base Price:</strong> ${Number(trip.base_price).toFixed(2)}</p>
       
        <p>
          <strong>Rating:</strong>{" "}
          {trip.avg_rating > 0
            ? Number(trip.avg_rating).toFixed(1)
            : "No ratings yet"}
        </p>

        <button className="btn btn-primary me-2" onClick={fetchRatings}>View Ratings</button>
        <button className="btn btn-success mt-2" onClick={() => onBook(trip.trip_id)}>
          Book This Trip
        </button>

        {showRatings && (
          <div className="mt-3">
            <h6>Rating Breakdown:</h6>
            <ul>
              {ratingDist.map((r) => (
                <li key={r.rating_score}>
                  {r.rating_score}★: {r.total_ratings}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-3">
          <h6>Customer Feedback:</h6>
          <ul>
            {allFeedback
              .filter(f => f.trip_name === trip.trip_name)
              .map((f, idx) => (
                <li key={idx}>
                  <strong>{f.first_name} {f.last_name}:</strong> {f.feedback}
                </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TripCard;