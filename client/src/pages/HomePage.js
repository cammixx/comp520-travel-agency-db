import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { fetchTrips, fetchTopBookedTrips, fetchAffordableTrips} from '../api/tripApi';

function HomePage() {
  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [showTopBooked, setShowTopBooked] = useState(false);
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');
  const [showCheapest, setShowCheapest] = useState(false);

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
  const handleAffordableSearch = async () => {
    if (!budget) return;
    const data = await fetchAffordableTrips(budget);
    setTrips(data);
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
  const handleCheapestTravelDays = async () => {
    if (showCheapest) {
      setTrips(allTrips);
    } else {
      try {
        const res = await fetch('http://localhost:5050/api/trips/cheapest-days');
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error('Failed to fetch cheapest travel days:', err);
      }
    }
    setShowCheapest(!showCheapest);
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
      <input
        type="number"
        placeholder="Enter budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        className="form-control w-auto"
      />
      <button
        className="btn btn-outline-success"
        onClick={handleAffordableSearch}
      >
        Show Affordable Trips
      </button>

      <button
  className="btn btn-outline-primary"
  onClick={handleCheapestTravelDays}
>
  {showCheapest ? 'Show All Trips' : 'Show Cheapest Travel Days'}
</button>

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