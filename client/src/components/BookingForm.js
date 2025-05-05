import React, { useState, useEffect } from 'react';
import { fetchTripList, fetchInsuranceOptions } from '../api/tripApi';

function BookingForm({ onSubmit, preselectedTripId }) {
  const [tripList, setTripList] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);

  const [tripId, setTripId] = useState(preselectedTripId || '');
  const [tripName, setTripName] = useState('');
  const [selectedTrip, setSelectedTrip] = useState(null); // ✅

  const [selectedInsurance, setSelectedInsurance] = useState('');
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

      const insurance = await fetchInsuranceOptions();
      setInsuranceList(insurance);

      if (preselectedTripId) {
        const id = Number(preselectedTripId);
        const selected = trips.find(t => t.trip_id === id);
        if (selected) {
          setTripId(id);
          setTripName(selected.trip_name);
          setSelectedTrip(selected); // ✅
        }
      }
    }

    loadData();
  }, [preselectedTripId]);

  const handleTripChange = (e) => {
    const id = Number(e.target.value);
    setTripId(id);
    const selected = tripList.find(t => t.trip_id === id);
    if (selected) {
      setTripName(selected.trip_name);
      setSelectedTrip(selected); // ✅
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      tripId,
      startDate,
      endDate,
      insuranceId: selectedInsurance ? selectedInsurance.insurance_id : null,
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

      {/* Trip selection */}
      {preselectedTripId ? (
        <div className="mb-3">
          <label className="form-label">Trip Selected</label>
          <input type="text" className="form-control" value={tripName} readOnly />
        </div>
      ) : (
        <div className="mb-3">
          <label className="form-label">Select Trip</label>
          <select
            className="form-select"
            value={tripId}
            onChange={handleTripChange}
            required
          >
            <option value="">-- Choose a trip --</option>
            {tripList.map((trip) => (
              <option key={trip.trip_id} value={trip.trip_id}>
                {trip.trip_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date selection */}
      <div className="mb-3">
        <label className="form-label">Start Date</label>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">End Date</label>
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      {/* Insurance selection */}
      <div className="mb-3">
        <label className="form-label">Choose Travel Insurance</label>
        <select
          className="form-select"
          value={selectedInsurance ? selectedInsurance.insurance_id : ''}
          onChange={(e) => {
            const ins = insuranceList.find(i => i.insurance_id === Number(e.target.value));
            setSelectedInsurance(ins || '');
          }}
        >
          <option value="">-- Select --</option>
          {insuranceList.map((ins) => (
            <option key={ins.insurance_id} value={ins.insurance_id}>
              {ins.provider_name} - ${ins.insurance_cost}
            </option>
          ))}
        </select>
      </div>

      {/* 💵 Cost Summary */}
      {selectedTrip && (
        <div className="mb-3 bg-white p-3 border rounded">
          <h6>💲 Cost Summary</h6>
          <p><strong>Base Price:</strong> ${Number(selectedTrip.base_price).toFixed(2)}</p>
          {selectedInsurance && (
            <p><strong>Insurance Cost:</strong> ${Number(selectedInsurance.insurance_cost).toFixed(2)}</p>
          )}
          <p>
            <strong>Total Price:</strong>{' '}
            ${(
              Number(selectedTrip.base_price) +
              (selectedInsurance ? Number(selectedInsurance.insurance_cost) : 0)
            ).toFixed(2)}
          </p>
        </div>
      )}

      <hr />

      {/* Customer info */}
      <h5 className="mt-3">Your Contact Info</h5>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">First Name *</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Middle Name</label>
          <input
            type="text"
            className="form-control"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label className="form-label">Last Name *</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Email *</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Phone *</label>
        <input
          type="text"
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">Confirm Booking</button>
    </form>
  );
}

export default BookingForm;