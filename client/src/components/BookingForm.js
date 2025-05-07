import React, { useState, useEffect } from 'react';
import {
  fetchTripList,
  fetchInsuranceOptions,
  fetchHotelList,
  fetchFlightList
} from '../api/tripApi';

function BookingForm({ onSubmit, preselectedTripId }) {
  const [tripList, setTripList] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);
  const [departureFlightId, setDepartureFlightId] = useState('');
  const [returnFlightId, setReturnFlightId] = useState('');
  const [flightList, setFlightList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [tripId, setTripId] = useState(preselectedTripId || '');
  const [tripName, setTripName] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null);


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
        setTripId(Number(preselectedTripId));
        const selected = trips.find(t => t.trip_id === Number(preselectedTripId));
        if (selected) {
          setTripName(selected.trip_name);
          setSelectedTrip(selected);
          const flights = await fetchFlightList(selected.trip_id);
          const hotels = await fetchHotelList(selected.trip_id);
          setFlightList(flights);
          setHotelList(hotels);
        }
      }
    }

    loadData();
  }, [preselectedTripId]);
  // useEffect(() => {
  //   if (departureFlightId && returnFlightId) {
  //     const depFlight = flightList.find(f => f.flight_id === departureFlightId);
  //     const retFlight = flightList.find(f => f.flight_id === returnFlightId);

  //     if (depFlight && retFlight) {
  //       if (depFlight.airline_name !== retFlight.airline_name) {
  //         setAirlineWarning('Warning: Please reselect for a round trip with the same airline.');
  //       } else if (depFlight.arrival_location_id !== retFlight.departure_location_id) {
  //         setAirlineWarning('Warning: Return flight must depart from the city you arrived in.');
  //       } else {
  //         setAirlineWarning('');
  //       }
  //     } else {
  //       setAirlineWarning('');
  //     }
  //   } else {
  //     setAirlineWarning('');
  //   }
  // }, [departureFlightId, returnFlightId, flightList]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Flights: both or none
    const flightSelected = departureFlightId || returnFlightId;
    if (flightSelected && (!departureFlightId || !returnFlightId)) {
      alert("Please select both departure and return flights if you want to include flights.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1);
    const base = Number(selectedTrip?.base_price || 0);
    const insurance = Number(selectedInsurance?.insurance_cost || 0);

    const departureFlight = flightList.find(f => f.flight_id === departureFlightId);
    const returnFlight = flightList.find(f => f.flight_id === returnFlightId);
    const flightCost = (Number(departureFlight?.price) || 0) + (Number(returnFlight?.price) || 0);

    const hotel = hotelList.find(h => h.hotel_id === selectedHotelId);
    const hotelCost = Number(hotel?.price_per_night || 0) * days;

    const total_price = base * days + insurance + flightCost + hotelCost;

    const bookingData = {
      tripId,
      startDate,
      endDate,
      insuranceId: selectedInsurance?.insurance_id || null,
      departureFlightId: departureFlightId || null,
      returnFlightId: returnFlightId || null,
      hotelId: selectedHotelId || null,
      total_price,
      customer: {
        firstName,
        middleName,
        lastName,
        email,
        phone
      }
    };

    console.log("🚀 Submitting booking payload:", bookingData);
    const result = await onSubmit(bookingData);

    if (result && result.success === false) {
      alert(result.error || "Booking failed. Please check your airline/location selections.");
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
      <h5>Trip Booking</h5>
      <p><span style={{ color: 'red' }}>*</span> Required fields</p>
      {!preselectedTripId && (
        <div className="mb-3">
          <label>
            Select Trip <span style={{ color: 'red' }}>*</span>
          </label>
          <select className="form-select" value={tripId} onChange={(e) => handleTripSelection(Number(e.target.value))} required>
            <option value="">-- Choose a trip --</option>
            {tripList.map(trip => (
              <option key={trip.trip_id} value={trip.trip_id}>{trip.trip_name}</option>
            ))}
          </select>
        </div>
      )}

      {preselectedTripId && (
        <div className="mb-3">
          <label>
            Trip <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="text" className="form-control" value={tripName} readOnly />
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-3">
          <label>
            Start Date <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="col-md-6 mb-3">
          <label>
            End Date <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
      </div>

      <div className="mb-3">
        <label>Departure Flight</label>
        <select
          className="form-select"
          value={departureFlightId || ""}
          onChange={e => setDepartureFlightId(e.target.value)}
        >
          <option value="" disabled>-- Select Departure --</option>
          {flightList.map(f => (
            <option key={f.flight_id} value={f.flight_id}>
              {f.airline_name}   | ${f.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Return Flight</label>
        <select className="form-select" value={returnFlightId} onChange={e => setReturnFlightId(Number(e.target.value))} >
          <option value="" disabled>-- Select Return --</option>
          {flightList
            .filter(f => {
              const depFlight = flightList.find(df => df.flight_id === departureFlightId);
              return !depFlight || f.departure_location_id === depFlight.arrival_location_id;
            })
            .map(f => (
              <option key={f.flight_id} value={f.flight_id}>
                {f.airline_name} | ${f.price}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-3">
        <label>Hotel</label>
        <select className="form-select" value={selectedHotelId || ''} onChange={e => setSelectedHotelId(e.target.value ? Number(e.target.value) : null)} >
          <option value="">-- Select Hotel --</option>
          {hotelList.map(h => (
            <option key={h.hotel_id} value={h.hotel_id}>
              {h.name} ${h.price_per_night}/night
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

      {selectedTrip && startDate && endDate && (
        <div className="mb-3">
          <label><strong>Estimated Total Price:</strong></label>
          <div className="form-control bg-light">
            {(() => {
              const start = new Date(startDate);
              const end = new Date(endDate);
              const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1);
              const base = Number(selectedTrip.base_price || 0);
              const insurance = Number(selectedInsurance?.insurance_cost || 0);

              const departureFlight = flightList.find(f => f.flight_id === departureFlightId);
              const returnFlight = flightList.find(f => f.flight_id === returnFlightId);
              const flightCost =
                (Number(departureFlight?.price) || 0) + (Number(returnFlight?.price) || 0);

              const hotel = hotelList.find(h => h.hotel_id === selectedHotelId);
              const hotelCost = Number(hotel?.price_per_night || 0) * days;

              const total = base * days + insurance + flightCost + hotelCost;

              return `$${total.toFixed(2)}`;
            })()}
          </div>
        </div>
      )}

      <hr />
      <h5>Contact Info</h5>
      <div className="row">
        <div className="col-md-4 mb-3">
          <label>
            First Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </div>
        <div className="col-md-4 mb-3">
          <label>Middle Name</label>
          <input className="form-control" value={middleName} onChange={e => setMiddleName(e.target.value)} />
        </div>
        <div className="col-md-4 mb-3">
          <label>
            Last Name <span style={{ color: 'red' }}>*</span>
          </label>
          <input className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
      </div>

      <div className="mb-3">
        <label>
          Email <span style={{ color: 'red' }}>*</span>
        </label>
        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label>
          Phone <span style={{ color: 'red' }}>*</span>
        </label>
        <input className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
      </div>

      <button type="submit" className="btn btn-primary">Confirm Booking</button>
    </form>
  );
}

export default BookingForm;