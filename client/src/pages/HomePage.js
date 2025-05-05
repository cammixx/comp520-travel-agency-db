import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { fetchTrips, fetchTopBookedTrips } from '../api/tripApi';

function HomePage() {
  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [showTopBooked, setShowTopBooked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTrips() {
      const data = await fetchTrips();
      setTrips(data);
      setAllTrips(data);
    }
    loadTrips();
  }, []);

  const handleBookTrip = (tripId) => {
    navigate(`/book?tripId=${tripId}`);
  };

  const handleToggleTopBooked = async () => {
    if (showTopBooked) {
      setTrips(allTrips);
    } else {
      const topBooked = await fetchTopBookedTrips();
      setTrips(topBooked);
    }
    setShowTopBooked(!showTopBooked);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Trips</h2>

      <div className="d-flex gap-3 mb-3">
        <button
          className="btn btn-outline-warning"
          onClick={handleToggleTopBooked}
        >
          {showTopBooked ? 'Show All Trips' : 'Show Top 5 Booked Trips'}
        </button>
      </div>

      <div className="row">
        {trips.map((trip) => (
          <div key={trip.trip_id} className="col-md-4 mb-4">
            <TripCard trip={trip} onBook={handleBookTrip} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;