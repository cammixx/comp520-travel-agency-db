import React, { useState, useEffect } from 'react';
import { fetchTripList, fetchInsuranceOptions, fetchHotelList, fetchFlightList } from '../api/tripApi';

function BookingForm({ onSubmit, preselectedTripId }) {
  const [tripList, setTripList] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);
  const [departureFlightId, setDepartureFlightId] = useState('');
  const [returnFlightId, setReturnFlightId] = useState('');
  const [flightList, setFlightList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [tripId, setTripId] = useState(preselectedTripId || '');
  const [tripName, setTripName] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function loadData() {
      const trips = await fetchTripList();
      setTripList(trips);
      const hotels = await fetchHotelList();
      setHotelList(hotels);
      const flights = await fetchFlightList();
      setFlightList(flights);
      const insurance = await fetchInsuranceOptions();
      setInsuranceList(insurance);

      if (preselectedTripId) {
        handleTripSelection(Number(preselectedTripId), trips);
      }
    }

    loadData();
  }, [preselectedTripId]);

  const handleTripSelection = async (id, list = tripList) => {
    setTripId(id);
    const selected = list.find(t => t.trip_id === id);
    if (selected) {
      setTripName(selected.trip_name);
      setSelectedTrip(selected);
      const flights = await fetchFlightList(id);
      const hotels = await fetchHotelList(id);
      setFlightList(flights);
      setHotelList(hotels);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      tripId,
      startDate,
      endDate,
      insuranceId: selectedInsurance?.insurance_id || null,
      departureFlightId,
      returnFlightId,
      hotelId: selectedHotelId || null,
      customer: {
        firstName,
        middleName,
        lastName,
        email,
        phone
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
      <h5>Trip Booking</h5>
      {!preselectedTripId && (
        <div className="mb-3">
          <label>Select Trip</label>
          <select className="form-select" value={tripId} onChange={(e) => handleTripSelection(Number(e.target.value))}>
            <option value="">-- Choose a trip --</option>
            {tripList.map(trip => (
              <option key={trip.trip_id} value={trip.trip_id}>{trip.trip_name}</option>
            ))}
          </select>
        </div>
      )}

      {preselectedTripId && (
        <div className="mb-3">
          <label>Trip</label>
          <input type="text" className="form-control" value={tripName} readOnly />
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>Start Date</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="col-md-6 mb-3">
          <label>End Date</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
      </div>

      <div className="mb-3">
        <label>Departure Flight</label>
        <select className="form-select" value={departureFlightId} onChange={e => setDepartureFlightId(e.target.value)} required>
          <option value="">-- Select Departure --</option>
          {flightList.map(f => (
            <option key={f.flight_id} value={f.flight_id}>
              {f.airline_name} | {f.departure_city} → {f.arrival_city} | {new Date(f.departure_datetime).toLocaleDateString()} | ${f.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Return Flight</label>
        <select className="form-select" value={returnFlightId} onChange={e => setReturnFlightId(e.target.value)} required>
          <option value="">-- Select Return --</option>
          {flightList.map(f => (
            <option key={f.flight_id} value={f.flight_id}>
              {f.airline_name} | {f.departure_city} → {f.arrival_city} | {new Date(f.departure_datetime).toLocaleDateString()} | ${f.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Hotel</label>
        <select className="form-select" value={selectedHotelId} onChange={e => setSelectedHotelId(e.target.value)} required>
          <option value="">-- Select Hotel --</option>
          {hotelList.map(h => (
            <option key={h.hotel_id} value={h.hotel_id}>
              {h.name} - ${h.price_per_night}/night
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Travel Insurance</label>
        <select
          className="form-select"
          value={selectedInsurance?.insurance_id || ''}
          onChange={e => {
            const ins = insuranceList.find(i => i.insurance_id === Number(e.target.value));
            setSelectedInsurance(ins || '');
          }}
        >
          <option value="">-- Select Insurance --</option>
          {insuranceList.map(ins => (
            <option key={ins.insurance_id} value={ins.insurance_id}>
              {ins.provider_name} - ${ins.insurance_cost}
            </option>
          ))}
        </select>
      </div>

      <hr />
      <h5>Contact Info</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>First Name</label>
          <input className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div className="col-md-4 mb-3">
          <label>Middle Name</label>
          <input className="form-control" value={middleName} onChange={e => setMiddleName(e.target.value)} />
        </div>
        <div className="col-md-4 mb-3">
          <label>Last Name</label>
          <input className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label>Phone</label>
        <input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
      </div>

      <button type="submit" className="btn btn-primary">Confirm Booking</button>
    </form>
  );
}

export default BookingForm;