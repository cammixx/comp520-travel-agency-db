import React from 'react';

function TripCard({ trip, onBook }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title text-success">{trip.trip_name}</h5>
        <p><strong>Type:</strong> {trip.trip_type}</p>
        <p><strong>Duration:</strong> {trip.duration} days</p>
        <p><strong>Price:</strong>{' '}{trip.base_price ? `$${Number(trip.base_price).toFixed(2)}` : 'N/A'}</p>
        <p>
          <strong>Rating:</strong>{" "}
          {trip.avg_rating && !isNaN(Number(trip.avg_rating))
            ? Number(trip.avg_rating).toFixed(1)
            : "No ratings yet"}
        </p>
        <button className="btn btn-success mt-2" onClick={() => onBook(trip.trip_id)}>
          Book This Trip
        </button>
      </div>
    </div>
  );
}

export default TripCard;