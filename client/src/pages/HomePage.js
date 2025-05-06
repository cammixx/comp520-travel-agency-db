import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import {
  fetchTrips,
  fetchTopBookedTrips,
  fetchAffordableTrips,
  fetchTopRatedTrips
} from '../api/tripApi';

function HomePage() {
  const [trips, setTrips] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [showTopBooked, setShowTopBooked] = useState(false);
  const [showTopRated, setShowTopRated] = useState(false);
  const [budget, setBudget] = useState('');
  const [showCheapest, setShowCheapest] = useState(false);
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('');

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

  const handleTripTypeSearch = async () => {
    if (!tripType) return;
    try {
      const res = await fetch(`http://localhost:5050/api/trips/type/${tripType}`);
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error('Failed to fetch trips by type:', err);
    }
  };

  const handleToggleTopBooked = async () => {
    if (showTopBooked) {
      setTrips(allTrips);
    } else {
      const topBooked = await fetchTopBookedTrips();
      setTrips(topBooked);
    }
    setShowTopBooked(!showTopBooked);
    setShowTopRated(false);
    setShowCheapest(false);
  };

  const handleToggleTopRated = async () => {
    if (showTopRated) {
      setTrips(allTrips);
    } else {
      const topRated = await fetchTopRatedTrips(4);
      setTrips(topRated);
    }
    setShowTopRated(!showTopRated);
    setShowTopBooked(false);
    setShowCheapest(false);
  };

  const handleCheapestTravelDays = async () => {
    if (showCheapest) {
      setTrips(allTrips);
    } else {
      try {
        const res = await fetch('http://localhost:5050/api/trips/cheapest-days');
        const data = await res.json();
        const mapped = data.map(item => ({
          trip_id: item.trip_id,
          trip_name: item.trip_name,
          trip_type: item.trip_type || 'N/A',
          duration: item.duration || 0,
          base_price: parseFloat(item.base_price) || 0,
          avg_rating: item.avg_rating || 0,
          total_price: parseFloat(item.total_price) || 0,
        }));
        setTrips(mapped);
      } catch (err) {
        console.error('Failed to fetch cheapest travel days:', err);
      }
    }
    setShowCheapest(!showCheapest);
    setShowTopRated(false);
    setShowTopBooked(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Trips</h2>

      <div className="d-flex gap-3 mb-3">
        <button className="btn btn-outline-warning" onClick={handleToggleTopBooked}>
          {showTopBooked ? 'Show All Trips' : 'Show Top 5 Booked Trips'}
        </button>
        <button className="btn btn-outline-info" onClick={handleToggleTopRated}>
          {showTopRated ? 'Show All Trips' : 'Show Top Rated Trips'}
        </button>
        <button className="btn btn-outline-primary" onClick={handleCheapestTravelDays}>
          {showCheapest ? 'Show All Trips' : 'Show Cheapest Travel Days'}
        </button>
      </div>
      <div className="input-group mb-3 w-50">
  <input
    type="text"
    placeholder="Enter trip type (e.g., Adventure)"
    value={tripType}
    onChange={(e) => setTripType(e.target.value)}
    className="form-control"
  />
  <button className="btn btn-outline-secondary" onClick={handleTripTypeSearch}>
    Show Trips by Type
  </button>
</div>

      <div className="input-group mb-3 w-50">
        <input
          type="number"
          placeholder="Enter budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-outline-success" onClick={handleAffordableSearch}>
          Show Affordable Trips
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